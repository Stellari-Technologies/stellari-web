// ─── api.ts ──────────────────────────────────────────────────────────────────
// Central API service for all Stellari backend calls.
// Every function here:
//   1. Reads the base URL from the environment
//   2. Automatically attaches the Cognito access token as a Bearer header
//   3. Parses errors in the standard { success, error, code } format from the API doc
//   4. Returns typed data so the rest of the app doesn't need to think about HTTP

import { fetchAuthSession } from 'aws-amplify/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Gets the current Cognito access token from Amplify's session.
// Every protected request needs this in the Authorization header.
async function getAccessToken(): Promise<string> {
  const session = await fetchAuthSession()
  const token = session.tokens?.accessToken?.toString()
  if (!token) throw new Error('No access token — user may not be logged in.')
  return token
}

// Core fetch wrapper — attaches auth header and parses the response.
// Pass requiresAuth: false only for public endpoints (e.g. GET /invitations/:token)
async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (requiresAuth) {
    const token = await getAccessToken()
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    // Use the human-readable error message from the API doc format:
    // { success: false, error: "...", code: "..." }
    throw new Error(data.error ?? `Request failed with status ${res.status}`)
  }

  return data.data as T
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Organization {
  id:               string
  organizationName: string
  organizationType: string
}

export interface User {
  id:    string
  email: string
}

export interface Membership {
  id:       string
  userType: 'account_owner' | 'staff'
}

export interface Participant {
  id:              string
  firstName:       string
  lastName:        string
  pointsBalance:   number
  dateOfBirth?:    string
  parentFirstName?: string
  parentLastName?:  string
  createdAt:       string
}

export interface Activity {
  id:            string
  title:         string
  description?:  string
  currencyValue: number
  isRepeatable:  boolean
  isActive:      boolean
}

export interface Reward {
  id:           string
  title:        string
  description?: string
  currencyCost: number
  isActive:     boolean
}

export interface StaffMember {
  userId:       string
  firstName:    string
  lastName:     string
  email:        string
  membershipId: string
  userType:     'account_owner' | 'staff'
  joinedAt:     string
}

export interface Transaction {
  id:        string
  type:      'earned' | 'redeemed'
  amount:    number
  activity?: { title: string }
  reward?:   { title: string }
  createdBy: { firstName: string; lastName: string }
  createdAt: string
}

export interface TransactionHistory {
  transactions:   Transaction[]
  currentBalance: number
}

export interface Invitation {
  id:        string
  email:     string
  status:    string
  expiresAt: string
}

export interface InviteDetails {
  email:            string
  organizationName: string
  expiresAt:        string
}

// ─── 1. Auth & Org Setup ─────────────────────────────────────────────────────

// Called once after the account owner verifies their email via Cognito.
// Creates the org in the database and returns the orgId — store this immediately.
export async function setupOrganization(
  organizationName: string,
  organizationType: string
): Promise<{ user: User; organization: Organization; membership: Membership }> {
  return request('/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ organizationName, organizationType }),
  })
}

// ─── 2. Staff Invite Flow ─────────────────────────────────────────────────────

// Owner sends an invite email to a staff member.
export async function sendStaffInvite(
  orgId: string,
  email: string
): Promise<Invitation> {
  return request(`/${orgId}/invitations`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Get invite details by token — PUBLIC, no auth needed.
// Call this when staff lands on the invite page.
export async function getInviteDetails(token: string): Promise<InviteDetails> {
  return request(`/invitations/${token}`, {}, false)
}

// Staff accepts the invite after completing Cognito signup.
// Call this AFTER the staff member has signed up and logged in via Cognito.
export async function acceptInvite(
  token: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<{ user: User; membership: Membership }> {
  return request(`/invitations/${token}/accept`, {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email }),
  })
}

// ─── 3. Staff Management ─────────────────────────────────────────────────────

export async function getStaff(orgId: string): Promise<StaffMember[]> {
  return request(`/${orgId}/staff`)
}

export async function getStaffMember(orgId: string, userId: string): Promise<StaffMember> {
  return request(`/${orgId}/staff/${userId}`)
}

export async function removeStaffMember(orgId: string, userId: string): Promise<void> {
  return request(`/${orgId}/staff/${userId}`, { method: 'DELETE' })
}

// ─── 4. Participant Management ───────────────────────────────────────────────

export async function createParticipant(
  orgId: string,
  data: {
    firstName:        string
    lastName:         string
    dateOfBirth?:     string
    parentFirstName?: string
    parentLastName?:  string
  }
): Promise<Participant> {
  return request(`/${orgId}/participants`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getParticipants(orgId: string): Promise<Participant[]> {
  return request(`/${orgId}/participants`)
}

export async function getParticipant(orgId: string, participantId: string): Promise<Participant> {
  return request(`/${orgId}/participants/${participantId}`)
}

export async function updateParticipant(
  orgId: string,
  participantId: string,
  data: Partial<Omit<Participant, 'id' | 'pointsBalance' | 'createdAt'>>
): Promise<Participant> {
  return request(`/${orgId}/participants/${participantId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteParticipant(orgId: string, participantId: string): Promise<void> {
  return request(`/${orgId}/participants/${participantId}`, { method: 'DELETE' })
}

// ─── 5. Activity Management ──────────────────────────────────────────────────

export async function createActivity(
  orgId: string,
  data: {
    title:         string
    description?:  string
    currencyValue: number
    isRepeatable?: boolean
  }
): Promise<Activity> {
  return request(`/${orgId}/activities`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getActivities(orgId: string): Promise<Activity[]> {
  return request(`/${orgId}/activities`)
}

export async function getActivity(orgId: string, activityId: string): Promise<Activity> {
  return request(`/${orgId}/activities/${activityId}`)
}

export async function updateActivity(
  orgId: string,
  activityId: string,
  data: Partial<Pick<Activity, 'title' | 'description' | 'currencyValue' | 'isRepeatable' | 'isActive'>>
): Promise<Activity> {
  return request(`/${orgId}/activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteActivity(orgId: string, activityId: string): Promise<void> {
  return request(`/${orgId}/activities/${activityId}`, { method: 'DELETE' })
}

// ─── 6. Reward Management ────────────────────────────────────────────────────

export async function createReward(
  orgId: string,
  data: {
    title:        string
    description?: string
    currencyCost: number
  }
): Promise<Reward> {
  return request(`/${orgId}/rewards`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getRewards(orgId: string): Promise<Reward[]> {
  return request(`/${orgId}/rewards`)
}

export async function getReward(orgId: string, rewardId: string): Promise<Reward> {
  return request(`/${orgId}/rewards/${rewardId}`)
}

export async function updateReward(
  orgId: string,
  rewardId: string,
  data: Partial<Pick<Reward, 'title' | 'description' | 'currencyCost' | 'isActive'>>
): Promise<Reward> {
  return request(`/${orgId}/rewards/${rewardId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteReward(orgId: string, rewardId: string): Promise<void> {
  return request(`/${orgId}/rewards/${rewardId}`, { method: 'DELETE' })
}

// ─── 7. Transactions (Star Management) ───────────────────────────────────────

// Staff completes an activity for a participant — adds stars to their balance.
export async function earnStars(
  orgId: string,
  participantId: string,
  activityId: string
): Promise<{ transaction: Transaction; newBalance: number }> {
  return request(`/${orgId}/participants/${participantId}/transactions/activity`, {
    method: 'POST',
    body: JSON.stringify({ activityId }),
  })
}

// Staff redeems a reward for a participant — deducts stars from their balance.
export async function redeemReward(
  orgId: string,
  participantId: string,
  rewardId: string
): Promise<{ transaction: Transaction; newBalance: number }> {
  return request(`/${orgId}/participants/${participantId}/transactions/reward`, {
    method: 'POST',
    body: JSON.stringify({ rewardId }),
  })
}

// Get full transaction history and current balance for a participant.
export async function getTransactions(
  orgId: string,
  participantId: string
): Promise<TransactionHistory> {
  return request(`/${orgId}/participants/${participantId}/transactions`)
}