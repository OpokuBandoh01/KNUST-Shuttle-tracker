"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Shield, Database, Globe, Save, RefreshCw, AlertTriangle, CheckCircle, Key, Mail, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { adminService } from "@/lib/backend/admin-service"
import { SystemSettings } from "@/lib/backend/types"
import { toast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  
  // State management
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
      return
    }
    loadSettings()
  }, [isAdmin, router])

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const settingsData = await adminService.getSystemSettings()
      setSettings(settingsData)
    } catch (error: any) {
      setError(error.message || "Failed to load settings")
      toast({
        title: "Error",
        description: error.message || "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSave = async () => {
    if (!settings) return
    
    try {
      setIsSaving(true)
      await adminService.updateSystemSettings(settings)
      setHasChanges(false)
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all settings to default values?")) {
      return
    }
    
    try {
      setIsResetting(true)
      await adminService.resetSystemSettings()
      await loadSettings()
      setHasChanges(false)
      toast({
        title: "Success",
        description: "Settings reset to defaults",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset settings",
        variant: "destructive"
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleGenerateApiKey = async () => {
    try {
      const newApiKey = await adminService.generateApiKey()
      setSettings(prev => prev ? {
        ...prev,
        security: {
          ...prev.security,
          apiKey: newApiKey
        }
      } : null)
      setHasChanges(true)
      toast({
        title: "Success",
        description: "New API key generated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate API key",
        variant: "destructive"
      })
    }
  }

  const updateSetting = (path: string, value: any) => {
    if (!settings) return
    
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current: any = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Settings</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadSettings}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Settings Found</h2>
          <p className="text-muted-foreground mb-4">System settings could not be loaded</p>
          <Button onClick={loadSettings}>Reload</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
          {hasChanges && (
            <p className="text-sm text-orange-600 mt-1">You have unsaved changes</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Resetting...' : 'Reset to Defaults'}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Basic system configuration and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input 
                    id="system-name" 
                    value={settings.systemName}
                    onChange={(e) => updateSetting('systemName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    value={settings.adminEmail}
                    onChange={(e) => updateSetting('adminEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input 
                    id="support-phone" 
                    value={settings.supportPhone}
                    onChange={(e) => updateSetting('supportPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">System Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Settings</CardTitle>
                <CardDescription>Configure system operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Tracking</Label>
                    <p className="text-sm text-muted-foreground">Enable live shuttle tracking</p>
                  </div>
                  <Switch 
                    checked={settings.realTimeTracking}
                    onCheckedChange={(checked) => updateSetting('realTimeTracking', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-backup</Label>
                    <p className="text-sm text-muted-foreground">Automatic daily data backup</p>
                  </div>
                  <Switch 
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-interval">Location Update Interval (seconds)</Label>
                  <Input 
                    id="update-interval" 
                    type="number"
                    value={settings.locationUpdateInterval}
                    onChange={(e) => updateSetting('locationUpdateInterval', parseInt(e.target.value) || 30)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Hours</CardTitle>
              <CardDescription>Configure shuttle service operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Weekdays</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weekday-start">Start Time</Label>
                      <Input 
                        id="weekday-start" 
                        type="time" 
                        value={settings.serviceHours.weekdays.start}
                        onChange={(e) => updateSetting('serviceHours.weekdays.start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekday-end">End Time</Label>
                      <Input 
                        id="weekday-end" 
                        type="time" 
                        value={settings.serviceHours.weekdays.end}
                        onChange={(e) => updateSetting('serviceHours.weekdays.end', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peak-frequency">Peak Hour Frequency</Label>
                    <Input 
                      id="peak-frequency" 
                      value={settings.serviceHours.weekdays.peakFrequency}
                      onChange={(e) => updateSetting('serviceHours.weekdays.peakFrequency', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offpeak-frequency">Off-Peak Frequency</Label>
                    <Input 
                      id="offpeak-frequency" 
                      value={settings.serviceHours.weekdays.offPeakFrequency}
                      onChange={(e) => updateSetting('serviceHours.weekdays.offPeakFrequency', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Weekends</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weekend-start">Start Time</Label>
                      <Input 
                        id="weekend-start" 
                        type="time" 
                        value={settings.serviceHours.weekends.start}
                        onChange={(e) => updateSetting('serviceHours.weekends.start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekend-end">End Time</Label>
                      <Input 
                        id="weekend-end" 
                        type="time" 
                        value={settings.serviceHours.weekends.end}
                        onChange={(e) => updateSetting('serviceHours.weekends.end', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekend-frequency">Service Frequency</Label>
                    <Input 
                      id="weekend-frequency" 
                      value={settings.serviceHours.weekends.frequency}
                      onChange={(e) => updateSetting('serviceHours.weekends.frequency', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.serviceHours.weekends.enabled}
                      onCheckedChange={(checked) => updateSetting('serviceHours.weekends.enabled', checked)}
                    />
                    <Label>Weekend Service Enabled</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Push Notifications
                </CardTitle>
                <CardDescription>Configure mobile push notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable mobile push notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications.pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable email notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications.emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable SMS notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications.smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Send daily usage reports to admins</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.dailyReports}
                    onCheckedChange={(checked) => updateSetting('notifications.dailyReports', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input 
                    id="smtp-server" 
                    value={settings.notifications.smtpServer}
                    onChange={(e) => updateSetting('notifications.smtpServer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port" 
                    value={settings.notifications.smtpPort}
                    onChange={(e) => updateSetting('notifications.smtpPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Input 
                    id="sender-email" 
                    value={settings.notifications.senderEmail}
                    onChange={(e) => updateSetting('notifications.senderEmail', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Send daily usage reports to admins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>Configure when to trigger system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delay-threshold">Delay Alert Threshold (minutes)</Label>
                  <Input 
                    id="delay-threshold" 
                    type="number"
                    value={settings.notifications.alertThresholds.delay}
                    onChange={(e) => updateSetting('notifications.alertThresholds.delay', parseInt(e.target.value) || 10)}
                  />
                  <p className="text-xs text-muted-foreground">Alert when shuttle is delayed by this amount</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity-threshold">Capacity Alert Threshold (%)</Label>
                  <Input 
                    id="capacity-threshold" 
                    type="number"
                    value={settings.notifications.alertThresholds.capacity}
                    onChange={(e) => updateSetting('notifications.alertThresholds.capacity', parseInt(e.target.value) || 90)}
                  />
                  <p className="text-xs text-muted-foreground">Alert when shuttle reaches this capacity</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-load-threshold">System Load Threshold (%)</Label>
                  <Input 
                    id="system-load-threshold" 
                    type="number"
                    value={settings.notifications.alertThresholds.systemLoad}
                    onChange={(e) => updateSetting('notifications.alertThresholds.systemLoad', parseInt(e.target.value) || 85)}
                  />
                  <p className="text-xs text-muted-foreground">Alert when system load exceeds this</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure user authentication and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security.twoFactorAuth', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                  </div>
                  <Switch 
                    checked={settings.security.passwordComplexity}
                    onCheckedChange={(checked) => updateSetting('security.passwordComplexity', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value) || 30)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input 
                    id="max-login-attempts" 
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security.maxLoginAttempts', parseInt(e.target.value) || 5)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Security
                </CardTitle>
                <CardDescription>Configure API access and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit API requests per user</p>
                  </div>
                  <Switch 
                    checked={settings.security.apiRateLimiting}
                    onCheckedChange={(checked) => updateSetting('security.apiRateLimiting', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit</Label>
                  <Input 
                    id="rate-limit" 
                    value={settings.security.rateLimit}
                    onChange={(e) => updateSetting('security.rateLimit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="api-key" 
                      type={showApiKey ? "text" : "password"}
                      value={settings.security.apiKey}
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleGenerateApiKey}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>HTTPS Only</Label>
                    <p className="text-sm text-muted-foreground">Force HTTPS for all connections</p>
                  </div>
                  <Switch 
                    checked={settings.security.httpsOnly}
                    onCheckedChange={(checked) => updateSetting('security.httpsOnly', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>Configure data retention and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period</Label>
                    <Input 
                      id="data-retention" 
                      value={settings.security.dataRetention}
                      onChange={(e) => updateSetting('security.dataRetention', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">How long to keep user data</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anonymous Analytics</Label>
                      <p className="text-sm text-muted-foreground">Collect anonymized usage data</p>
                    </div>
                    <Switch 
                      checked={settings.security.anonymousAnalytics}
                      onCheckedChange={(checked) => updateSetting('security.anonymousAnalytics', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Backup Retention</Label>
                    <Input 
                      id="backup-retention" 
                      value={settings.security.backupRetention}
                      onChange={(e) => updateSetting('security.backupRetention', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">How long to keep backups</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt sensitive user data</p>
                    </div>
                    <Switch 
                      checked={settings.security.dataEncryption}
                      onCheckedChange={(checked) => updateSetting('security.dataEncryption', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  External Services
                </CardTitle>
                <CardDescription>Configure third-party service integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Google Maps API</p>
                      <p className="text-xs text-muted-foreground">For mapping and navigation</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.googleMapsApi.enabled ? "default" : "secondary"}>
                        {settings.integrations.googleMapsApi.enabled ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateSetting('integrations.googleMapsApi.enabled', !settings.integrations.googleMapsApi.enabled)}
                      >
                        {settings.integrations.googleMapsApi.enabled ? "Configure" : "Setup"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Firebase Cloud Messaging</p>
                      <p className="text-xs text-muted-foreground">For push notifications</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.firebaseCloudMessaging.enabled ? "default" : "secondary"}>
                        {settings.integrations.firebaseCloudMessaging.enabled ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateSetting('integrations.firebaseCloudMessaging.enabled', !settings.integrations.firebaseCloudMessaging.enabled)}
                      >
                        {settings.integrations.firebaseCloudMessaging.enabled ? "Configure" : "Setup"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">SMS Gateway</p>
                      <p className="text-xs text-muted-foreground">For SMS notifications</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.smsGateway.enabled ? "default" : "secondary"}>
                        {settings.integrations.smsGateway.enabled ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateSetting('integrations.smsGateway.enabled', !settings.integrations.smsGateway.enabled)}
                      >
                        {settings.integrations.smsGateway.enabled ? "Configure" : "Setup"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Settings
                </CardTitle>
                <CardDescription>Configure database and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Database Host</Label>
                  <Input 
                    id="db-host" 
                    value={settings.database.host}
                    onChange={(e) => updateSetting('database.host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input 
                    id="db-name" 
                    value={settings.database.name}
                    onChange={(e) => updateSetting('database.name', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Daily automatic backups</p>
                  </div>
                  <Switch 
                    checked={settings.database.autoBackup}
                    onCheckedChange={(checked) => updateSetting('database.autoBackup', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-time">Backup Time</Label>
                  <Input 
                    id="backup-time" 
                    type="time" 
                    value={settings.database.backupTime}
                    onChange={(e) => updateSetting('database.backupTime', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    name: "Database", 
                    status: settings.systemStatus.database, 
                    icon: settings.systemStatus.database === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.database === 'operational' ? "text-green-600" : settings.systemStatus.database === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                  { 
                    name: "API Server", 
                    status: settings.systemStatus.apiServer, 
                    icon: settings.systemStatus.apiServer === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.apiServer === 'operational' ? "text-green-600" : settings.systemStatus.apiServer === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                  { 
                    name: "Real-time Service", 
                    status: settings.systemStatus.realTimeService, 
                    icon: settings.systemStatus.realTimeService === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.realTimeService === 'operational' ? "text-green-600" : settings.systemStatus.realTimeService === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                  { 
                    name: "Push Notifications", 
                    status: settings.systemStatus.pushNotifications, 
                    icon: settings.systemStatus.pushNotifications === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.pushNotifications === 'operational' ? "text-green-600" : settings.systemStatus.pushNotifications === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                  { 
                    name: "SMS Service", 
                    status: settings.systemStatus.smsService, 
                    icon: settings.systemStatus.smsService === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.smsService === 'operational' ? "text-green-600" : settings.systemStatus.smsService === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                  { 
                    name: "Backup System", 
                    status: settings.systemStatus.backupSystem, 
                    icon: settings.systemStatus.backupSystem === 'operational' ? CheckCircle : AlertTriangle, 
                    color: settings.systemStatus.backupSystem === 'operational' ? "text-green-600" : settings.systemStatus.backupSystem === 'degraded' ? "text-yellow-600" : "text-red-600" 
                  },
                ].map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <service.icon className={`h-5 w-5 ${service.color}`} />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{service.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
