var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
         // luu cookie thong tin co the nhin thay
         console.log(authResult.user.displayName)
         console.log(authResult.user.email)
         console.log(authResult.user.uid)
         setCookie("displayName", authResult.user.displayName, 1)
         setCookie("email", authResult.user.email, 1)
         setCookie("uid", authResult.user.uid, 1)
         setCookie("photoURL", authResult.user.photoURL, 1)
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/',
    // Privacy policy url.
    privacyPolicyUrl: '/'
    // Other config options...
  });

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }