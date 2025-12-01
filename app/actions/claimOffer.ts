'use server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
)

export async function claimOffer(offerId: string, userId: string) {
  // Step 1: Atomic reservation
  const { data: reserved, error: reserveError } = await supabaseAdmin
    .from('offers')
    .update({ 
      status: 'reserved', 
      reserved_by: userId, 
      reserved_at: new Date().toISOString() 
    })
    .eq('id', offerId)
    .eq('status', 'available')
    .select()

  if (reserveError || !reserved || reserved.length === 0) {
    return { success: false, message: 'Offer already claimed' }
  }

  // Step 2: Create claim record
  const { error: claimError } = await supabaseAdmin
    .from('claims')
    .insert({ offer_id: offerId, claimer_id: userId })

  // Step 3: Mark as claimed
  await supabaseAdmin
    .from('offers')
    .update({ status: 'claimed' })
    .eq('id', offerId)
    .eq('reserved_by', userId)

  return { success: true, message: 'Offer claimed successfully!' }
}
