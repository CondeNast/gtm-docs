<script>
  _CNEcommerce = function (ctx, dataLayerName) {
    console.debug("CNEcomm init");
    
    this.ctx = ctx;
    this.dataLayerName = dataLayerName || "dataLayer";
    this.cfg = {};
    
    this.ready();
    
    this.cfg = function (market, brand, siteIdentifier) {
      if (market && this._validMarket(market)) { this.cfg.market = market; }
      if (brand && this._validBrand(brand)) { this.cfg.brand = brand; }
      if (siteIdentifier && this._validSiteIdentifier(siteIdentifier)) { this.cfg.siteIdentifier = siteIdentifier; }
    };
    
    this._push = function(msg) {
      console.debug("pushing to dl:", msg);
      this.ctx[this.dataLayerName].push(msg);
    };
    
    this._event = function (e) {
      return new Event(e); 
    };
    
    this._validMarket = function(market) {
      return ["gb"].indexOf(market) !== -1;
    };
    
    this._validBrand = function(brand) {
      return ["vg", "gq", "tr", "ta", "wi", "wo", "gl", "jh"].indexOf(brand) !== -1;
    };
    
    this._siteIdentifier = function (siteIdentifier) {
      return ["magazine-boutique"].indexOf(siteIdentifier) !== -1;
    };
   
    this.targettingConsentReceived = function (consent) {
      this.targettingConsent = !!consent;
      this._push({"event": "_cn_targetting_consent_" + this.targettingConsent ? "accepted" : "rejected"});
    };
    
    this.triggerCMP = function () {
      this._push({"event": "_cn_cmp_request"});
    };
    
    this.checkout = function(event) {
      event['_cn_action'] = 'transaction';
      this._push(event);
    };
    
    this.addToBasket = function (event) {
      event['_cn_action'] = 'add_to_basket';
      this._push(event);
    };
    
    this.membershipApplication = function (event) {
      event['_cn_action'] = 'membership_application';
      this._push(event);
    };
    
    this.ready = function () {
      this.ctx.dispatchEvent(this._event("cnecom_ready"));
    };
  };
  
  (function(w, n, d) {
    var cne = w[n];
    if (!cne) {
      w[n] = new _CNEcommerce(w, d);
    }
  }(window, "CNEcommerce", "dataLayer"));
</script>
