package com.neighbourly

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import io.branch.rnbranch.RNBranchModule

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "Neighbourly"

  // Branch.io: Handle deep link session init
  override fun onStart() {
    super.onStart()
    RNBranchModule.initSession(intent?.data, this) // ✅ Correct place
  }

  // Branch.io: Handle new intents (when app is already open)
  override fun onNewIntent(intent: Intent) {
      super.onNewIntent(intent)
      setIntent(intent)
      RNBranchModule.onNewIntent(intent) // ✅ sirf intent pass karo
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

