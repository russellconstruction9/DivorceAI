@@ .. @@
 import React from 'react';
+import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
+import { useAuth } from './hooks/useAuth';
+import { SubscriptionStatus } from './components/subscription/SubscriptionStatus';
+import { Login } from './pages/Login';
+import { Signup } from './pages/Signup';
+import { Pricing } from './pages/Pricing';
+import { Success } from './pages/Success';
 
 function App() {
+  const { user, loading, signOut } = useAuth();
+
+  if (loading) {
+    return (
+      <div className="min-h-screen flex items-center justify-center">
+        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
+      </div>
+    );
+  }
+
   return (
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <p>Start prompting (or editing) to see magic happen :)</p>
-    </div>
+    <Router>
+      <div className="min-h-screen bg-gray-100">
+        {user && (
+          <nav className="bg-white shadow-sm border-b">
+            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
+              <div className="flex justify-between h-16">
+                <div className="flex items-center">
+                  <h1 className="text-xl font-semibold text-gray-900">CustodyX.AI</h1>
+                </div>
+                <div className="flex items-center space-x-4">
+                  <div className="hidden sm:block">
+                    <SubscriptionStatus />
+                  </div>
+                  <div className="flex items-center space-x-4">
+                    <a href="/pricing" className="text-gray-700 hover:text-gray-900">
+                      Pricing
+                    </a>
+                    <button
+                      onClick={signOut}
+                      className="text-gray-700 hover:text-gray-900"
+                    >
+                      Sign Out
+                    </button>
+                  </div>
+                </div>
+              </div>
+            </div>
+          </nav>
+        )}
+
+        <Routes>
+          <Route path="/login" element={<Login />} />
+          <Route path="/signup" element={<Signup />} />
+          <Route 
+            path="/pricing" 
+            element={user ? <Pricing /> : <Navigate to="/login" replace />} 
+          />
+          <Route 
+            path="/success" 
+            element={user ? <Success /> : <Navigate to="/login" replace />} 
+          />
+          <Route 
+            path="/" 
+            element={
+              user ? (
+                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
+                  <div className="px-4 py-6 sm:px-0">
+                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
+                      <div className="text-center">
+                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
+                          Welcome to CustodyX.AI
+                        </h2>
+                        <p className="text-gray-600 mb-6">
+                          Your co-parenting documentation platform
+                        </p>
+                        <div className="sm:hidden mb-4">
+                          <SubscriptionStatus />
+                        </div>
+                        <a
+                          href="/pricing"
+                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
+                        >
+                          View Pricing
+                        </a>
+                      </div>
+                    </div>
+                  </div>
+                </div>
+              ) : (
+                <Navigate to="/login" replace />
+              )
+            } 
+          />
+        </Routes>
+      </div>
+    </Router>
   );
 }
 
 export default App;