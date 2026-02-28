/*
  # Security Fixes: Indexes, RLS Performance, and Configuration

  ## 1. Foreign Key Indexes
  Adding indexes for all foreign key columns to improve query performance

  ## 2. RLS Performance Optimization
  Wrapping all auth.uid() calls in (SELECT auth.uid()) to prevent re-evaluation per row

  ## 3. Remove Unused Indexes
  Dropping indexes that have not been used to reduce maintenance overhead

  ## 4. Security Improvements
  - Fixing overly permissive RLS policies
  - Setting proper search paths for functions
*/

-- ============================================================================
-- 1. ADD FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_activity_logs_automation_id ON public.activity_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_business_id ON public.activity_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_automations_business_id ON public.automations(business_id);
CREATE INDEX IF NOT EXISTS idx_business_members_user_id ON public.business_members(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON public.call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_ads_template_id ON public.generated_ads(template_id);
CREATE INDEX IF NOT EXISTS idx_leads_business_id ON public.leads(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_granted_by ON public.user_roles(granted_by);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES
-- ============================================================================

-- User Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (id = (SELECT auth.uid()));

-- Published Ads
DROP POLICY IF EXISTS "Users can view own published ads" ON public.published_ads;
CREATE POLICY "Users can view own published ads" ON public.published_ads FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own published ads" ON public.published_ads;
CREATE POLICY "Users can insert own published ads" ON public.published_ads FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own published ads" ON public.published_ads;
CREATE POLICY "Users can update own published ads" ON public.published_ads FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own published ads" ON public.published_ads;
CREATE POLICY "Users can delete own published ads" ON public.published_ads FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- Business Members
DROP POLICY IF EXISTS "Business owner can manage members" ON public.business_members;
CREATE POLICY "Business owner can manage members" ON public.business_members FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owner can update members" ON public.business_members;
CREATE POLICY "Business owner can update members" ON public.business_members FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can view their memberships" ON public.business_members;
CREATE POLICY "Users can view their memberships" ON public.business_members FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- Push Subscriptions
DROP POLICY IF EXISTS "Users can view own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can view own push subscriptions" ON public.push_subscriptions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can create own push subscriptions" ON public.push_subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can update own push subscriptions" ON public.push_subscriptions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can delete own push subscriptions" ON public.push_subscriptions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- Businesses
DROP POLICY IF EXISTS "Users can view their own businesses" ON public.businesses;
CREATE POLICY "Users can view their own businesses" ON public.businesses FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own businesses" ON public.businesses;
CREATE POLICY "Users can update their own businesses" ON public.businesses FOR UPDATE TO authenticated USING (owner_id = (SELECT auth.uid())) WITH CHECK (owner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own businesses" ON public.businesses;
CREATE POLICY "Users can insert their own businesses" ON public.businesses FOR INSERT TO authenticated WITH CHECK (owner_id = (SELECT auth.uid()));

-- Campaigns
DROP POLICY IF EXISTS "Business owners can view campaigns" ON public.campaigns;
CREATE POLICY "Business owners can view campaigns" ON public.campaigns FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can create campaigns" ON public.campaigns;
CREATE POLICY "Business owners can create campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can update campaigns" ON public.campaigns;
CREATE POLICY "Business owners can update campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Leads
DROP POLICY IF EXISTS "Business owners can view leads" ON public.leads;
CREATE POLICY "Business owners can view leads" ON public.leads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can create leads" ON public.leads;
CREATE POLICY "Business owners can create leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can update leads" ON public.leads;
CREATE POLICY "Business owners can update leads" ON public.leads FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Automations
DROP POLICY IF EXISTS "Business owners can view automations" ON public.automations;
CREATE POLICY "Business owners can view automations" ON public.automations FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can create automations" ON public.automations;
CREATE POLICY "Business owners can create automations" ON public.automations FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can update automations" ON public.automations;
CREATE POLICY "Business owners can update automations" ON public.automations FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Activity Logs
DROP POLICY IF EXISTS "Business owners can view activity logs" ON public.activity_logs;
CREATE POLICY "Business owners can view activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Reviews
DROP POLICY IF EXISTS "Business owners can view reviews" ON public.reviews;
CREATE POLICY "Business owners can view reviews" ON public.reviews FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Meta Accounts
DROP POLICY IF EXISTS "Users can view Meta accounts for their businesses" ON public.meta_accounts;
CREATE POLICY "Users can view Meta accounts for their businesses" ON public.meta_accounts FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can insert Meta accounts" ON public.meta_accounts;
CREATE POLICY "Business owners can insert Meta accounts" ON public.meta_accounts FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can update Meta accounts" ON public.meta_accounts;
CREATE POLICY "Business owners can update Meta accounts" ON public.meta_accounts FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Business owners can delete Meta accounts" ON public.meta_accounts;
CREATE POLICY "Business owners can delete Meta accounts" ON public.meta_accounts FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Campaign Sync Logs
DROP POLICY IF EXISTS "Users can view sync logs for their business campaigns" ON public.campaign_sync_logs;
CREATE POLICY "Users can view sync logs for their business campaigns" ON public.campaign_sync_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.campaigns c JOIN public.businesses b ON c.business_id = b.id WHERE c.id = campaign_id AND b.owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can insert sync logs for their business campaigns" ON public.campaign_sync_logs;
CREATE POLICY "Users can insert sync logs for their business campaigns" ON public.campaign_sync_logs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns c JOIN public.businesses b ON c.business_id = b.id WHERE c.id = campaign_id AND b.owner_id = (SELECT auth.uid())));

-- Call Logs
DROP POLICY IF EXISTS "Users can view call logs for their business" ON public.call_logs;
CREATE POLICY "Users can view call logs for their business" ON public.call_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can create call logs for their business" ON public.call_logs;
CREATE POLICY "Users can create call logs for their business" ON public.call_logs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can update their own call logs" ON public.call_logs;
CREATE POLICY "Users can update their own call logs" ON public.call_logs FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

-- User 2FA
DROP POLICY IF EXISTS "Users can view own 2FA settings" ON public.user_2fa;
CREATE POLICY "Users can view own 2FA settings" ON public.user_2fa FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own 2FA settings" ON public.user_2fa;
CREATE POLICY "Users can create own 2FA settings" ON public.user_2fa FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own 2FA settings" ON public.user_2fa;
CREATE POLICY "Users can update own 2FA settings" ON public.user_2fa FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own 2FA settings" ON public.user_2fa;
CREATE POLICY "Users can delete own 2FA settings" ON public.user_2fa FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- Onboarding Progress
DROP POLICY IF EXISTS "Users can view own onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can view own onboarding progress" ON public.onboarding_progress FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can insert own onboarding progress" ON public.onboarding_progress FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can update own onboarding progress" ON public.onboarding_progress FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Users can delete own onboarding progress" ON public.onboarding_progress FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- Global API Keys
DROP POLICY IF EXISTS "Admins with 2FA can view API keys" ON public.global_api_keys;
CREATE POLICY "Admins with 2FA can view API keys" ON public.global_api_keys FOR SELECT TO authenticated USING (public.is_admin_with_2fa((SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins with 2FA can create API keys" ON public.global_api_keys;
CREATE POLICY "Admins with 2FA can create API keys" ON public.global_api_keys FOR INSERT TO authenticated WITH CHECK (public.is_admin_with_2fa((SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins with 2FA can update API keys" ON public.global_api_keys;
CREATE POLICY "Admins with 2FA can update API keys" ON public.global_api_keys FOR UPDATE TO authenticated USING (public.is_admin_with_2fa((SELECT auth.uid()))) WITH CHECK (public.is_admin_with_2fa((SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins with 2FA can delete API keys" ON public.global_api_keys;
CREATE POLICY "Admins with 2FA can delete API keys" ON public.global_api_keys FOR DELETE TO authenticated USING (public.is_admin_with_2fa((SELECT auth.uid())));

-- Ad Templates
DROP POLICY IF EXISTS "Users can view system templates and their own templates" ON public.ad_templates;
CREATE POLICY "Users can view system templates and their own templates" ON public.ad_templates FOR SELECT TO authenticated USING (is_system_template = true OR business_id IN (SELECT id FROM public.businesses WHERE owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can create their own templates" ON public.ad_templates;
CREATE POLICY "Users can create their own templates" ON public.ad_templates FOR INSERT TO authenticated WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can update their own templates" ON public.ad_templates;
CREATE POLICY "Users can update their own templates" ON public.ad_templates FOR UPDATE TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = (SELECT auth.uid()))) WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can delete their own templates" ON public.ad_templates;
CREATE POLICY "Users can delete their own templates" ON public.ad_templates FOR DELETE TO authenticated USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = (SELECT auth.uid())));

-- Generated Ads
DROP POLICY IF EXISTS "Users can view their business generated ads" ON public.generated_ads;
CREATE POLICY "Users can view their business generated ads" ON public.generated_ads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can create generated ads" ON public.generated_ads;
CREATE POLICY "Users can create generated ads" ON public.generated_ads FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can update their generated ads" ON public.generated_ads;
CREATE POLICY "Users can update their generated ads" ON public.generated_ads FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can delete their generated ads" ON public.generated_ads;
CREATE POLICY "Users can delete their generated ads" ON public.generated_ads FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

-- Ad Performance
DROP POLICY IF EXISTS "Users can view their ad performance" ON public.ad_performance;
CREATE POLICY "Users can view their ad performance" ON public.ad_performance FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.generated_ads ga JOIN public.businesses b ON ga.business_id = b.id WHERE ga.id = generated_ad_id AND b.owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can create ad performance records" ON public.ad_performance;
CREATE POLICY "Users can create ad performance records" ON public.ad_performance FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.generated_ads ga JOIN public.businesses b ON ga.business_id = b.id WHERE ga.id = generated_ad_id AND b.owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can update ad performance" ON public.ad_performance;
CREATE POLICY "Users can update ad performance" ON public.ad_performance FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.generated_ads ga JOIN public.businesses b ON ga.business_id = b.id WHERE ga.id = generated_ad_id AND b.owner_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.generated_ads ga JOIN public.businesses b ON ga.business_id = b.id WHERE ga.id = generated_ad_id AND b.owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can delete ad performance records" ON public.ad_performance;
CREATE POLICY "Users can delete ad performance records" ON public.ad_performance FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.generated_ads ga JOIN public.businesses b ON ga.business_id = b.id WHERE ga.id = generated_ad_id AND b.owner_id = (SELECT auth.uid())));

-- Custom Media
DROP POLICY IF EXISTS "Users can view media from their business" ON public.custom_media;
CREATE POLICY "Users can view media from their business" ON public.custom_media FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can upload media to their business" ON public.custom_media;
CREATE POLICY "Users can upload media to their business" ON public.custom_media FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) AND EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users can delete their own media" ON public.custom_media;
CREATE POLICY "Users can delete their own media" ON public.custom_media FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- API Keys
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;
CREATE POLICY "Users can view their own API keys" ON public.api_keys FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own API keys" ON public.api_keys;
CREATE POLICY "Users can insert their own API keys" ON public.api_keys FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own API keys" ON public.api_keys;
CREATE POLICY "Users can update their own API keys" ON public.api_keys FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.api_keys;
CREATE POLICY "Users can delete their own API keys" ON public.api_keys FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- API Key Audit Log
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.api_key_audit_log;
CREATE POLICY "Admins can view audit logs" ON public.api_key_audit_log FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

DROP POLICY IF EXISTS "System can insert audit logs" ON public.api_key_audit_log;
CREATE POLICY "System can insert audit logs" ON public.api_key_audit_log FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

-- User Roles
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
CREATE POLICY "Super admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'super_admin' AND is_active = true));

DROP POLICY IF EXISTS "Super admins can grant roles" ON public.user_roles;
CREATE POLICY "Super admins can grant roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'super_admin' AND is_active = true));

DROP POLICY IF EXISTS "Super admins can update roles" ON public.user_roles;
CREATE POLICY "Super admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'super_admin' AND is_active = true)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'super_admin' AND is_active = true));

DROP POLICY IF EXISTS "Super admins can delete roles" ON public.user_roles;
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'super_admin' AND is_active = true));

-- User Onboarding Data
DROP POLICY IF EXISTS "Users can view own onboarding data" ON public.user_onboarding_data;
CREATE POLICY "Users can view own onboarding data" ON public.user_onboarding_data FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own onboarding data" ON public.user_onboarding_data;
CREATE POLICY "Users can insert own onboarding data" ON public.user_onboarding_data FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own onboarding data" ON public.user_onboarding_data;
CREATE POLICY "Users can update own onboarding data" ON public.user_onboarding_data FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

-- Meta Connections
DROP POLICY IF EXISTS "Users can view own Meta connections" ON public.meta_connections;
CREATE POLICY "Users can view own Meta connections" ON public.meta_connections FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own Meta connections" ON public.meta_connections;
CREATE POLICY "Users can insert own Meta connections" ON public.meta_connections FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own Meta connections" ON public.meta_connections;
CREATE POLICY "Users can update own Meta connections" ON public.meta_connections FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own Meta connections" ON public.meta_connections;
CREATE POLICY "Users can delete own Meta connections" ON public.meta_connections FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- Subscription Plans
DROP POLICY IF EXISTS "Only admins can manage plans" ON public.subscription_plans;
CREATE POLICY "Only admins can manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- User Subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- AI Usage Tracking
DROP POLICY IF EXISTS "Users can view own usage" ON public.ai_usage_tracking;
CREATE POLICY "Users can view own usage" ON public.ai_usage_tracking FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "System can insert usage records" ON public.ai_usage_tracking;
CREATE POLICY "System can insert usage records" ON public.ai_usage_tracking FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can view all usage" ON public.ai_usage_tracking;
CREATE POLICY "Admins can view all usage" ON public.ai_usage_tracking FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- Usage Limits
DROP POLICY IF EXISTS "Users can view own limits" ON public.usage_limits;
CREATE POLICY "Users can view own limits" ON public.usage_limits FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own limits" ON public.usage_limits;
CREATE POLICY "Users can update own limits" ON public.usage_limits FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all limits" ON public.usage_limits;
CREATE POLICY "Admins can manage all limits" ON public.usage_limits FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- Analytics Events
DROP POLICY IF EXISTS "Users can insert own analytics events" ON public.analytics_events;
CREATE POLICY "Users can insert own analytics events" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can read own analytics events" ON public.analytics_events;
CREATE POLICY "Users can read own analytics events" ON public.analytics_events FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can read all analytics events" ON public.analytics_events;
CREATE POLICY "Admins can read all analytics events" ON public.analytics_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- AI Usage Costs
DROP POLICY IF EXISTS "Users can view own AI usage" ON public.ai_usage_costs;
CREATE POLICY "Users can view own AI usage" ON public.ai_usage_costs FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin can view all AI usage" ON public.ai_usage_costs;
CREATE POLICY "Admin can view all AI usage" ON public.ai_usage_costs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'super_admin') AND is_active = true));

-- ============================================================================
-- 3. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_campaigns_impressions;
DROP INDEX IF EXISTS public.idx_campaigns_reach;
DROP INDEX IF EXISTS public.idx_campaigns_total_spend;
DROP INDEX IF EXISTS public.idx_campaigns_ctr;
DROP INDEX IF EXISTS public.idx_campaigns_status_active;
DROP INDEX IF EXISTS public.idx_user_subscriptions_status;
DROP INDEX IF EXISTS public.idx_ai_usage_tracking_user_id;
DROP INDEX IF EXISTS public.idx_ai_usage_tracking_business_id;
DROP INDEX IF EXISTS public.idx_ai_usage_tracking_created_at;
DROP INDEX IF EXISTS public.idx_ai_usage_tracking_subscription_id;
DROP INDEX IF EXISTS public.idx_push_subscriptions_active;
DROP INDEX IF EXISTS public.idx_push_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_push_subscriptions_business_id;
DROP INDEX IF EXISTS public.call_logs_business_id_idx;
DROP INDEX IF EXISTS public.call_logs_created_at_idx;
DROP INDEX IF EXISTS public.idx_global_api_keys_created_by;
DROP INDEX IF EXISTS public.idx_global_api_keys_provider;
DROP INDEX IF EXISTS public.idx_global_api_keys_active;
DROP INDEX IF EXISTS public.idx_api_keys_user_id;
DROP INDEX IF EXISTS public.idx_audit_log_user_id;
DROP INDEX IF EXISTS public.idx_audit_log_api_key_id;
DROP INDEX IF EXISTS public.idx_audit_log_action;
DROP INDEX IF EXISTS public.idx_audit_log_created_at;
DROP INDEX IF EXISTS public.idx_ad_templates_business_id;
DROP INDEX IF EXISTS public.idx_generated_ads_business_id;
DROP INDEX IF EXISTS public.idx_generated_ads_campaign_id;
DROP INDEX IF EXISTS public.idx_user_roles_active;
DROP INDEX IF EXISTS public.idx_ad_performance_generated_ad_id;
DROP INDEX IF EXISTS public.idx_ad_performance_business_id;
DROP INDEX IF EXISTS public.idx_ad_performance_date;
DROP INDEX IF EXISTS public.idx_user_2fa_user_id;
DROP INDEX IF EXISTS public.idx_user_2fa_enabled;
DROP INDEX IF EXISTS public.idx_meta_accounts_business_id;
DROP INDEX IF EXISTS public.idx_campaigns_meta_account_id;
DROP INDEX IF EXISTS public.idx_campaigns_meta_campaign_id;
DROP INDEX IF EXISTS public.idx_campaign_sync_logs_campaign_id;
DROP INDEX IF EXISTS public.idx_custom_media_user_id;
DROP INDEX IF EXISTS public.idx_custom_media_created_at;
DROP INDEX IF EXISTS public.idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_user_subscriptions_business_id;
DROP INDEX IF EXISTS public.idx_usage_limits_user_id;
DROP INDEX IF EXISTS public.idx_usage_limits_business_id;
DROP INDEX IF EXISTS public.idx_analytics_user_id;
DROP INDEX IF EXISTS public.idx_analytics_category;
DROP INDEX IF EXISTS public.idx_analytics_name;
DROP INDEX IF EXISTS public.idx_analytics_timestamp;
DROP INDEX IF EXISTS public.idx_analytics_session;
DROP INDEX IF EXISTS public.idx_analytics_plan;
DROP INDEX IF EXISTS public.idx_analytics_trial_days;
DROP INDEX IF EXISTS public.idx_analytics_conversion;
DROP INDEX IF EXISTS public.idx_user_profiles_subscription_plan;
DROP INDEX IF EXISTS public.idx_user_profiles_usage;
DROP INDEX IF EXISTS public.idx_analytics_summary_date;
DROP INDEX IF EXISTS public.idx_user_onboarding_plan_type;
DROP INDEX IF EXISTS public.idx_user_onboarding_generation_usage;
DROP INDEX IF EXISTS public.idx_ai_usage_user;
DROP INDEX IF EXISTS public.idx_ai_usage_created;
DROP INDEX IF EXISTS public.idx_ai_usage_endpoint;
DROP INDEX IF EXISTS public.idx_api_keys_encrypted;
DROP INDEX IF EXISTS public.idx_global_api_keys_encrypted;
DROP INDEX IF EXISTS public.idx_meta_accounts_encrypted;
DROP INDEX IF EXISTS public.idx_meta_connections_user_id;
DROP INDEX IF EXISTS public.idx_meta_connections_status;
DROP INDEX IF EXISTS public.idx_published_ads_user_id;
DROP INDEX IF EXISTS public.idx_published_ads_status;
DROP INDEX IF EXISTS public.idx_published_ads_meta_ad_id;
DROP INDEX IF EXISTS public.idx_published_ads_created_at;

-- ============================================================================
-- 4. FIX FUNCTION SEARCH PATHS
-- ============================================================================

ALTER FUNCTION public.calculate_trial_days SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_analytics_summary SET search_path = public, pg_temp;
ALTER FUNCTION public.reset_monthly_ad_generations SET search_path = public, pg_temp;
ALTER FUNCTION public.set_generation_limit SET search_path = public, pg_temp;
ALTER FUNCTION public.update_meta_updated_at_column SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_iv SET search_path = public, pg_temp;
ALTER FUNCTION public.calculate_business_metrics SET search_path = public, pg_temp;
ALTER FUNCTION public.check_ai_usage_limit SET search_path = public, pg_temp;
ALTER FUNCTION public.record_ai_usage SET search_path = public, pg_temp;
ALTER FUNCTION public.reset_subscription_usage SET search_path = public, pg_temp;
ALTER FUNCTION public.assign_free_plan_to_user SET search_path = public, pg_temp;
ALTER FUNCTION public.create_default_usage_limits SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column SET search_path = public, pg_temp;
ALTER FUNCTION public.check_expired_roles SET search_path = public, pg_temp;
ALTER FUNCTION public.has_2fa_enabled SET search_path = public, pg_temp;
ALTER FUNCTION public.is_admin_with_2fa SET search_path = public, pg_temp;
