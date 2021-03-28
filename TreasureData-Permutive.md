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

# Sequence Diagram

![Sequence Diagram](diagrams/sequence-diagram.svg) Edit
[sequence-diagram.drawio](diagrams/sequence-diagram.drawio) with draw.io

<<<<<<< HEAD
# GTM Zones - Global Container (GTM-KSK3JJ9)
Our current TreasureData implementation leverages a [GTM zone](https://support.google.com/tagmanager/answer/7647043?hl=en) to manage the setup across all GTM containers. GTM Zones allow a GTM container to load another GTM container. GTM Zones are completely handled through the GTM web UI and do not require adding any additional GTM scripts to the page. This setup 1) minimizes the size of the local GTM container (200KB limit) and 2) does not require additional dev work to the page.

# TreasureData Ecommerce Events
Note that the following GTM configurations do not include additional tags, triggers, and variables needed for ecommerce events for TD. TD Ecommerce configurations through GTM can be found in the [TreasureData Ecommerce](TreasureData-Ecommerce.md) document.
=======
Note that the following GTM configurations do not include additional tags, triggers, and variables needed for ecommerce events for TD. TD Ecommerce configurations through GTM can be found in the TreasureData-Ecommerce document.
>>>>>>> parent of a798292 (Update TreasureData-Permutive.md)

# Tags

## TreasureData Tag

Initializes the TreasureData Javascript SDK and fetches the sever-side cookie.

Triggers on:
1. **Page View**: Fires immediately when the browser loads the page and user has already consented to Targeting cookies.
2. **CE - OneTrust Consent Events - Targeting**: Fires when a user consents to Targeting cookies. dataLayer events OneTrustGroupsUpdated and OneTrustLoaded are emitted from OneTrust when a user consents to cookie tracking or updates consent settings. 
```html
<script type="text/javascript">
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
  (function(win,doc,tdName){
    var td = win[tdName] = new Treasure({
      host: {{Constant - TreasureData Host}},
      database: {{LT - TreasureData Database}},
      writeKey: {{LT - TreasureData Write Key}},
      trackCrossDomain: true,
      startInSignedMode: true,
      useServerSideCookie: true
    });

    function sscSuccessCallback (result) {
      td.set("$global", "td_ssc_id", result);
      console.log("$global td_ssc_id set to '" + result + "'");
      dataLayer.push({
        event: "td_ssc_id_success",
        td_ssc_id: result
      });
    }

    function sscErrorCallback () {
      dataLayer.push({
        event: "td_ssc_id_failed"
      });
    }

    td.set("$global","td_global_id","td_global_id");
    td.fetchServerCookie(sscSuccessCallback, sscErrorCallback);
  })(window, document, {{Constant - TreasureData Instance Name}});
</script>
```

## Permutive Ready Tag

Waits for Permutive to be ready and then pushes the dataLayer permutive_ready event so other tags know that Permutive is ready and can trigger off permutive_ready.

Trigger as soon as `permutive` is defined.

Conventionally this would be **Page View** however for the
[Compass Rocket](https://github.com/condenast/rocket) application this needs to
be **Window Load** because the permutive implementation is not included in the
html `<head>` tag.

```html
<script>
  if (typeof permutive != "undefined") {
    permutive.ready(function () {
      dataLayer.push({
        event: "permutive_ready"
      });
    });
  } else {
    console.error("Permutive not available");
  }
</script>
```

## TreasureData Pageview Tag

The TreasureData Pageview Tag does a few things before calling TreasureData `trackEvent` to record the page view:
1. Sets the Permutive user ID on all calls to TreasureData with td.set()
2. Creates googleSyncCallback() to pass the TreasureData user ID to Google when it's called during TreasureData `trackEvent` at the end of the script
3. Defines `data`, which is an object of all the variables we want to send to TreasureData. `data` gets its values from places like the dataLayer and document object properties/methods.

Triggers on
Trigger Group - (CE - permutive_ready | CE - td_ssc events), which is a Trigger Group of 2 triggers:
1. CE - permutive_ready
2. CE - td_ssc

```html
<script>
  (function(win,doc,tdName){
    var td = win[tdName];
    
    var permutiveId = permutive.context.user_id
    td.set('$global', 'td_unknown_id', permutiveId);
    permutive.identify([{
                        tag: 'td_unknown_id',
                        id: permutiveId,
                        priority: 0
                    }]);
    
    
    function googleSyncCallback() {
      var gidsync_url = '//cm.g.doubleclick.net/pixel?';
      var params = [
        'google_nid=treasuredata_dmp',
        'google_cm',
        'td_write_key=' + {{Constant - TreasureData DMP Key}},
        'td_global_id=td_global_id',
        'td_client_id=' + td.client.track.uuid,
        'td_host=' + doc.location.host,
        'account=' + {{Constant - TreasureData Account ID}}
      ];
      var img = new Image();
      img.src = gidsync_url + params.join('&');
    }

    ga(function(){
     var gaId = "";
     var trackers = ga.getAll();
     if (trackers && trackers[0]) {
       gaId = trackers[0].get('clientId');
     }

      // Define event data
	  var data = {};
	  data["pageTemplate"] = {{CJS - Page Template}};
	  data["Distribution Platform"] = {{CJS - Distribution Platform}};
	  data["Browser language "] = {{JSV - navigator.language}};
	  // ...add more values as required here...

	  
      //Set GA Client ID globally
      td.set('$global', 'GA Client ID', gaId);
  
      // Send pageview event along with additional data
      td.trackEvent(
        {{LT - TreasureData Pageview Table}},
        data,
        googleSyncCallback,
        googleSyncCallback
      );
    });
  })(window, document, {{Constant - TreasureData Instance Name}});
</script>
```

## TreasureData - Set Permutive email_sha256 to TD User Segment

Calls TreasureData with the Permutive ID to get the email_sha256.  This sends both email_sha256 and Permutive ID to TD for the market master segment. Please note that each market has a different Master Segments API Key to drop in place of any temp keys.

Triggers on Trigger Group - (Window Loaded - All Pages | CE - OneTrust Consent Events - Targeting | CE - permutive_ready), which is a Trigger Group of 3 triggers:
1. Window Loaded - All Pages
2. CE - OneTrust Consent Events - Targeting
3. CE - permutive_ready

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
       
            permutive.identify([{
              tag: "email_sha256",
              id: email_sha256,
              priority: 1
            }]);
      }
    }
    function error(err) {
      console.log(err);
    }
    td.fetchUserSegments({
      audienceToken: {{LT - TreasureData Master Segments API Key}},
      keys: {"permutiveid": permutive.context.user_id}
    }, success, error);
  })(window, {{Constant - TreasureData Instance Name}});
</script>
```

# Triggers

## Permutive Ready Trigger

Fires when Permutive has loaded and set the
[Permutive User ID](#permutive-user-id) variable

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `permutive_ready` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## TreasureData SCC Trigger

Fires when the server-side-cookie is received or the request fails.

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `/^td_scc_.*/`    |
| Use regex matching    | Yes               |
| This trigger fires on | All Custom Events |

## TreasureData Email Hash Trigger

Fires when the user's email hash is received.

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `email_hash`      |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Trigger Group - (CE - permutive_ready | CE - td_ssc events)

Fires when _both_ the [permutive_ready](#permutive-ready-trigger) and
[td_ssc](#treasuredata-scc-trigger) triggers have fired.

| Property              | Value                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Trigger Type          | Trigger Group                                                                               |
| Triggers              | [Permutive Ready](#permutive-ready-trigger) and [TresaureData SCC](#treasuredata-scc-trigger) |
| This trigger fires on | All Conditions                                                                              |

## Trigger Group - (Window Loaded - All Pages | CE - OneTrust Consent Events - Targeting | CE - permutive_ready)

Fires when Window Loaded, OneTrust Consent Events - Targeting, and permutive_ready and the TD Master Segments API key has been set

| Property              | Value                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Trigger Type          | Trigger Group                                                                               |
| Triggers              | Window Loaded, OneTrust Consent Events - Targeting, and permutive_ready |
| This trigger fires on | LT - TreasureData Master Segments API Key does not equal undefined                          |

# Variables

## Constant - TreasureData Instance Name

Name of the globally scoped variable that holds the instance of the TreasureData
javascript SDK. IN documentation examples this is usually `td`. A constant is
used incase this needs to be changed to avoid collisions with other variables on
the page.

| Property      | Value    |
| ------------- | -------- |
| Variable Type | Constant |
| Value         | `td`     |


## Constant - TreasureData Account ID

The ID of the account with TreasureData. This will be in a format like this:
`eu01-01`.

| Property      | Value     |
| ------------- | --------- |
| Variable Type | Constant  |
| Value         | `eu01-57` |

## Constant - TreasureData DMP Key

The TD DMP key that's sent to Google when calling googleSyncCallback().

| Property      | Value     |
| ------------- | --------- |
| Variable Type | Constant  |
| Value         | `8151/fcd628065149d648b80f11448b4083528c0d8a91` |

## Constant - TreasureData Host

The host for where TD requests should be sent to.

| Property      | Value     |
| ------------- | --------- |
| Variable Type | Constant  |
| Value         | `eu01.in.treasuredata.com` 

## LT - TreasureData Master Segments API Key

Regex lookup table of TD Master Segments API Keys. Looks at {{Page URL}} to determine which value should be outputted.

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Regex Table              |


## LT - TreasureData Pageview Table

Regex lookup table of TD pageview tables to determine which table should store the data. Looks at {{Page URL}} to determine which value should be outputted.

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Regex Table              |


## LT - TreasureData Database

Regex lookup table of TreasureData database to store values. Looks at {{Page URL}} to determine which value should be outputted. You can see this list of
databases in the console https://console.eu01.treasuredata.com/app/databases

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Regex Table              |

## LT - TreasureData Write Key

Regex lookup table of TreasureData write key that identifies the client with permission to send data to TreasureData. Looks at {{Page URL}} to determine which value should be outputted. This should be available in the TreasureData console under “Profile API Tokens”

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Regex Table              |
