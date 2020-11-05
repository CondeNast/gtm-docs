# TreasureData & Permutive Implementation with Google Tag Manager

In the majority of cases we use, or intend to use Google Tag Manager(GTM) to
manage third party integrations running on our page, wherever possible.

We use both Permutive and TreasureData amongst other third party technologies to
track users as they visit our pages. Both of these ecosystems provide
identifiers that need to be shared between the systems to be most effective.
This document records the steps required to integrate Permutive and TreasureData
on a Condé Nast site using GTM.

Permutive is a third party Data Management Platform (DMP). Unlike the majority
of other integrations done using GTM, Permutive is integrated into our sites
using a javascript tag that must be included directly in the head tag of the
page. The instructions for integrating Permutive on a site can be found here
https://developer.permutive.com/docs/web ARM TreasureData is a Customer Data
Platform (CDP).

Where possible we will integrate TreasureData with Condé Nast sites using GTM.
This means that concerns like consent compliance and the order of loading
dependencies is managed in GTM rather than being tightly coupled in javascript
source code of our sites. The instructions for integrating TreasureData on a
site tiwout GTM can be found here
https://tddocs.atlassian.net/wiki/spaces/PD/pages/1081498/Web+Tracking and the
documentation of the TreasureData Javascript SDK is here
https://github.com/treasure-data/td-js-sdk

To configure Permutive and TreasureData to operate on a page and share the
required information we will need to add the following to our GTM configuration.

# Tags

## TreasureData Tag

Initializes the TreasureData Javascript SDK and fetches the sever-side cookie.

Triggers on consent

```html
<script type="text/javascript">
  // This is the boilerplate TD script
  !(function (t, e) {
    if (void 0 === e[t]) {
      (e[t] = function () {
        e[t].clients.push(this),
          (this._init = [Array.prototype.slice.call(arguments)]);
      }),
        (e[t].clients = []);
      for (
        var r = function (t) {
            return function () {
              return (
                (this["_" + t] = this["_" + t] || []),
                this["_" + t].push(Array.prototype.slice.call(arguments)),
                this
              );
            };
          },
          s = [
            "blockEvents",
            "setSignedMode",
            "fetchServerCookie",
            "unblockEvents",
            "setSignedMode",
            "setAnonymousMode",
            "resetUUID",
            "addRecord",
            "fetchGlobalID",
            "fetchUserSegments",
            "set",
            "trackEvent",
            "trackPageview",
            "trackClicks",
            "ready",
          ],
          n = 0;
        n < s.length;
        n++
      ) {
        var o = s[n];
        e[t].prototype[o] = r(o);
      }
      var c = document.createElement("script");
      (c.type = "text/javascript"),
        (c.async = !0),
        (c.src =
          ("https:" === document.location.protocol ? "https:" : "http:") +
          "//cdn.treasuredata.com/sdk/2.2/td.min.js");
      var i = document.getElementsByTagName("script")[0];
      i.parentNode.insertBefore(c, i);
    }
  })("Treasure", this);
</script>

<script>

  // Conde Nast specific TreasureData and Permutive integration
  (function(win,doc,tdName){

    // Values must be true before the TreasureData page view event is sent
    var tdSscSet = false;
    var permutiveIdSet = false;

    // Create an instance of the TreasureData SDK object and assign it to the global scope using the specified variable name
    var td = win[tdName] = new Treasure({
      host: 'eu01.in.treasuredata.com',
      database: {{TreasureData Database}},
      writeKey: {{TreasureData Write Key}},
      trackCrossDomain: true,
      startInSignedMode: true,
      useServerSideCookie: true
    });

    // Attempt to send the treasure data pageView event if all the required values have been populated
    function tryTrackPaveView(){

      // Check all the required values are set before sending the PageView event.
      if(!tdSscSet || !permutiveIdSet){
        return;
      }

      // Define event data
      var data = {};
      data["userAgent"] = {{userAgent}};
      data["pageURL"] = {{pageURL}};
      data["pageTitle"] = {{pageTitle}};
      // ...add more values as required here...

      // Send PageView event along with additional data
      td.trackEvent(
        {{TreasureData Pageview Event}},
        data,
        googleSyncCallback,
        googleSyncCallback
      );
    }

    // Handle a successful attempt to get the Server-Side-Cookie identifier from TreasureData
    function sscSuccessCallback (result) {
      // Populate a "global" value on the TreasureData instance so the Server-Side-Cookie identifier is sent with all TreasureData events
      td.set("$global", "td_ssc_id", result);

      // Push this event to the dataLayer with the Server-Side-Cookie identifier incase other scripts need to respond
      // dataLayer.push({
      //   event: "td_ssc_id_success",
      //   td_ssc_id: result
      // });

      tdSscSet = true;
      tryTrackPaveView();
    }

    // Handle an unsuccessful attempt to get the Server-Side-Cookie identifier from TreasureData
    function sscErrorCallback () {
      // Push this event to the dataLayer incase other scripts need to respond
      // dataLayer.push({
      //   event: "td_ssc_id_failed"
      // });

      tdSscSet = true;
      tryTrackPaveView();
    }

    // Handle a successful attempt to get the user segments from TreasureData
    function userSegmentsSuccessCallback(values) {
      if(
        values.length > 0 &&
        values[0].attributes &&
        values[0].attributes.email_sha256
      ){
        var email_sha256 = values[0].attributes.email_sha256;

        // Set the email hash in permutive
        win.permutive.identify([{
          tag: "email_sha256",
          id: email_sha256,
          priority: 1
        }]);

        // Push the user segment data to the dataLayer
        // dataLayer.push({
        //   "event":"email_hash",
        //   "email_sha256": email_sha256
        // });
      }
    }

    // Handle an unsuccessful attempt to get the user segments from TreasureData
    function userSegmentsErrorCallback(err) {
      console.log(err);
    }

    // Callback from TreasureData trackEvent
    function googleSyncCallback() {

      // Invokes a request to google ad network
      var gidsync_url = '//cm.g.doubleclick.net/pixel?';
      var params = [
        'google_nid=treasuredata_dmp',
        'google_cm',
        'td_write_key=' + {{TreasureData Write Key}},
        'td_global_id=td_global_id',
        'td_client_id=' + td.client.track.uuid,
        'td_host=' + doc.location.host,
        'account=' + {{TreasureData Account ID}}
      ];
      var img = new Image();
      img.src = gidsync_url + params.join('&');
    }

    // Handle permutive ready callback after it has populated the user ID
    function permutiveReadyHandler(){

      // Requirement of TreasureData that permutive duplicates it's own ID with a different name.
      win.permutive.identify([{
        tag: "td_unknown_id",
        id: win.permutive.context.user_id,
        priority: 0
      }]);

      // Push permutive id to the dataLayer
      // win.dataLayer.push({
      //   event: "permutive_ready",
      //   permutive_user_id: win.permutive.context.user_id,
      // });

      permutiveIdSet = true;
      tryTrackPaveView();

      // Fetch user segments from TreasureData
      td.fetchUserSegments(
        {
          audienceToken: {{TreasureData Write Key}},
          keys: {"permutive_id": {{Permutive User Id}}}
        },
        userSegmentsSuccessCallback,
        userSegmentsErrorCallback
      );
    }

    // Attempts to setup permutive ready handler is permutive is available on the global scope
    function trySetPermutiveReadyHandler(){
      if (win.permutive && win.permutive.ready) {
        win.permutive.ready(permutiveReadyHandler);
        return true;
      }
      return false;
    }

    // Try to setup permutive ready handler
    if(!trySetPermutiveReadyHandler()){
      // If initial ready handler couldn't be set, wait for all resources in the window to load and try again
      win.addEventListener('load', trySetPermutiveReadyHandler);
    }

    // Set the literal string "td_global_id" to be sent with all TreasureData events (unclear why)
    td.set("$global","td_global_id","td_global_id");

    // Initiate the call to get the Server-Side-Cookie identifier from TreasureData
    td.fetchServerCookie(sscSuccessCallback, sscErrorCallback);

  })(window, document, {{TreasureData Instance Name}});
</script>
```

## TresureDate PageView Tag

Calls TreasureData `trackEvent` to record the page view then passes the
TreasuerData user id to Google.

Triggers on
[Permutive Ready and TresureData SCC](#permutive-ready-and-tresuredata-scc-trigger)

```html
<script>
  (function(win,doc,tdName){
    var td = win[tdName];

    function googleSyncCallback() {
      var gidsync_url = '//cm.g.doubleclick.net/pixel?';
      var params = [
        'google_nid=treasuredata_dmp',
        'google_cm',
        'td_write_key=' + {{TreasureData Write Key}},
        'td_global_id=td_global_id',
        'td_client_id=' + td.client.track.uuid,
        'td_host=' + doc.location.host,
        'account=' + {{TreasureData Account ID}}
      ];
      var img = new Image();
      img.src = gidsync_url + params.join('&');
    }

    // Define event data
    var data = {};
    data["userAgent"] = {{userAgent}};
    data["pageURL"] = {{pageURL}};
    data["pageTitle"] = {{pageTitle}};
    // ...add more values as required here...

    // Send pageview event along with additional data
    td.trackEvent(
      {{TreasureData Pageview Event}},
      data,
      googleSyncCallback,
      googleSyncCallback
    );
  })(window, document, {{TreasureData Instance Name}});
</script>
```

## Permutive Set Email Hash Tag

Calls Permutive `identify` to pass the email hash.

Triggers on [TresureData Email Hash](#tresuredata-email-hash-trigger)

```html
<script>
  (function(win){
    var permutive = win["permutive"];
    permutive.ready(function() {
      permutive.identify([{
        tag: "email_sha256",
        id: {{Email Hash}},
        priority: 1
      }]);
    });
  })(window);
</script>
```

## TreasureData Get Email Hash Tag

Calls TreasureData with the permutive id to get the email hash and fire the
[TresureData Email Hash](#tresuredata-email-hash-trigger) custom event.

Triggers on [Permutive Ready](#permutive-ready-trigger)

```html
<script>
  (function(win, tdName){
    var td = win[tdName];
    function success(values) {
      if(
        values.length > 0 &&
        values[0].attributes &&
        values[0].attributes.email_sha256
      ){
        var email_sha256 = values[0].attributes.email_sha256;
        dataLayer.push({
          "event":"email_hash",
          "email_sha256": email_sha256
        });
      }
    }
    function error(err) {
      console.log(err);
    }
    td.fetchUserSegments({
      audienceToken: {{TreasureData Write Key}},
      keys: {"permutive_id": {{Permutive User Id}}}
    }, success, error);
  })(window, {{TreasureData Instance Name}});
</script>
```

# Triggers

None

# Variables

## TreasureData Database

Name of the TreasureData database to store values. You can see this list of
databases in the console https://console.eu01.treasuredata.com/app/databases

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Constant              |
| Value         | `cdp_audience_109553` |

## TreasureData Instance Name

Name of the globally scoped variable that holds the instance of the TreasureData
javascript SDK. IN documentation examples this is usually `td`. A constant is
used incase this needs to be changed to avoid collisions with other variables on
the page.

| Property      | Value    |
| ------------- | -------- |
| Variable Type | Constant |
| Value         | `td`     |

## TreasureData Write Key

Key identifying the client with permission to send data to TreasureData. This
should be available in the TreasureData console under “Profile API Tokens”

| Property      | Value                                  |
| ------------- | -------------------------------------- |
| Variable Type | Constant                               |
| Value         | `75b7e70b-b035-4c9c-8b0d-4cfbfe712c00` |

## TreasureData Account ID

The ID of the account with TreasureData. This will be in a format like this:
`eu01-01`.

| Property      | Value     |
| ------------- | --------- |
| Variable Type | Constant  |
| Value         | `eu01-57` |
