'use server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
)

export async function claimOffer(offerId: string, userId: string) {
  try {
    // Step 1: Atomic reservation - this ensures only one user can claim
    const { data: reserved, error: reserveError } = await supabaseAdmin
      .from('offers')
      .update({ 
        status: 'reserved', 
        reserved_by: userId, 
        reserved_at: new Date().toISOString() 
      })
      .eq('id', offerId)
      .eq('status', 'available') // Only update if status is still 'available'
      .select()

    if (reserveError) {
      console.error('Reserve error:', reserveError)
      return { success: false, message: 'Failed to reserve offer. Please try again.' }
    }

    if (!reserved || reserved.length === 0) {
      return { success: false, message: 'This offer has already been claimed by someone else!' }
    }

    // Step 2: Create claim record
    const { error: claimError } = await supabaseAdmin
      .from('claims')
      .insert({ offer_id: offerId, claimer_id: userId })

    if (claimError) {
      console.error('Claim error:', claimError)
      // Rollback: set status back to available
      await supabaseAdmin
        .from('offers')
        .update({ status: 'available', reserved_by: null, reserved_at: null })
        .eq('id', offerId)
        .eq('reserved_by', userId)
      
      return { success: false, message: 'Failed to create claim record. Please try again.' }
    }

    // Step 3: Mark as claimed (final step)
    const { error: updateError } = await supabaseAdmin
      .from('offers')
      .update({ status: 'claimed' })
      .eq('id', offerId)
      .eq('reserved_by', userId)

    if (updateError) {
      console.error('Update error:', updateError)
      return { success: false, message: 'Failed to finalize claim. Please contact support.' }
    }

    return { success: true, message: 'Offer claimed successfully!' }

  } catch (error) {
    console.error('Unexpected error in claimOffer:', error)
    return { success: false, message: 'An unexpected error occurred. Please try again.' }
  }
}
