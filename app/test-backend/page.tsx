"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Users,
  BarChart3
} from "lucide-react"
import { adminService } from "@/lib/backend/admin-service"
import { driverService } from "@/lib/backend/driver-service"
import { Driver, Analytics } from "@/lib/backend/types"

export default function TestBackendPage() {
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; data?: any }>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [testDriver, setTestDriver] = useState({
    driverId: "TEST-001",
    name: "Test Driver",
    email: "test@knust.edu.gh",
    password: "test123456",
    phone: "+233 123 456 789",
    vehicleNumber: "TEST-1234",
    route: "test-route"
  })

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    try {
      setIsLoading(true)
      const result = await testFunction()
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          message: `${testName} completed successfully`,
          data: result
        }
      }))
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          message: `${testName} failed: ${error.message}`,
          data: null
        }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const testAdminService = async () => {
    await runTest("Admin Analytics", () => adminService.getAnalytics())
    await runTest("Admin Alerts", () => adminService.getAlerts())
    await runTest("Admin System Settings", () => adminService.getSystemSettings())
  }

  const testDriverService = async () => {
    await runTest("Driver Service - Get Drivers", () => driverService.getDrivers(10))
    await runTest("Driver Service - Search Drivers", () => driverService.searchDrivers("test"))
    await runTest("Driver Service - Get Active Drivers", () => driverService.getActiveDrivers())
  }

  const testCreateDriver = async () => {
    await runTest("Create Test Driver", () => 
      driverService.createDriver({
        ...testDriver,
        isActive: true
      })
    )
  }

  const testDeleteTestDriver = async () => {
    await runTest("Delete Test Driver", () => 
      driverService.deleteDriver(testDriver.driverId)
    )
  }

  const runAllTests = async () => {
    setTestResults({})
    await testAdminService()
    await testDriverService()
  }

  const getTestIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getTestColor = (success: boolean) => {
    if (success) return "border-green-200 bg-green-50"
    return "border-red-200 bg-red-50"
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TestTube className="h-8 w-8 text-blue-600" />
            Backend Service Testing
          </h1>
          <p className="text-muted-foreground mt-2">
            Test all backend services to ensure they're working correctly
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run tests to verify backend functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Database className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>
              <Button 
                onClick={testAdminService} 
                disabled={isLoading}
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Test Admin Service
              </Button>
              <Button 
                onClick={testDriverService} 
                disabled={isLoading}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Test Driver Service
              </Button>
              <Button 
                onClick={testCreateDriver} 
                disabled={isLoading}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Create Test Driver
              </Button>
              <Button 
                onClick={testDeleteTestDriver} 
                disabled={isLoading}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Delete Test Driver
              </Button>
            </div>
            
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Running tests...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Driver Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Driver Configuration</CardTitle>
            <CardDescription>Configure the test driver for creation/deletion tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-driver-id">Driver ID</Label>
                <Input
                  id="test-driver-id"
                  value={testDriver.driverId}
                  onChange={(e) => setTestDriver(prev => ({ ...prev, driverId: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-driver-name">Name</Label>
                <Input
                  id="test-driver-name"
                  value={testDriver.name}
                  onChange={(e) => setTestDriver(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-driver-email">Email</Label>
                <Input
                  id="test-driver-email"
                  type="email"
                  value={testDriver.email}
                  onChange={(e) => setTestDriver(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-driver-phone">Phone</Label>
                <Input
                  id="test-driver-phone"
                  value={testDriver.phone}
                  onChange={(e) => setTestDriver(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Test Results</h2>
          
          {Object.keys(testResults).length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tests have been run yet. Click "Run All Tests" to start testing.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {Object.entries(testResults).map(([testName, result]) => (
                <Card key={testName} className={getTestColor(result.success)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTestIcon(result.success)}
                        {testName}
                      </CardTitle>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "PASSED" : "FAILED"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{result.message}</p>
                    {result.data && (
                      <div className="mt-3 p-3 bg-background rounded border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Response Data:</p>
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {Object.keys(testResults).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(testResults).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(testResults).filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(testResults).filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
