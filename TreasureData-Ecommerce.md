# TreasureData Ecommerce Implementation

GTM ecommerce implementations need to follow the official [GTM Enhanced Ecommerce (UA) Developer Guide](https://developers.google.com/tag-manager/enhanced-ecommerce) to ensure that dataLayer events are standardzied across implementations. 

Note about GA4: 
As of March 2021, we are still using the Universal Analytics ecommerce implementation because GA4 is not enterprise-friendly yet. Per Google: 
> "GA4 is compatible with the UA ecommerce schema, but the UA ecommerce schema is not compatible with the GA4 schema. If you have tagged your site for GA4 properties alongside UA, do not replace your older schemas with GA4 ecommerce data types."* 

Examples of ecommerce events:

1. eecClick
2. eecImpression
3. ecAddToCart
4. eecRemoveFromCart
5. eecCheckout
6. eecTransaction

# Tags

## TreasureData - Ecomm Tag - Product Click

Calls TreasureData `trackEvent` to record product clicks and passes in `ecommData`.

Triggers on: **eecClick**

```html
<script>
  var productClickData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'product click';
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Product ID'] = {{DL - ecommerce.click}}['products'][0].id;
    ecommData['Product Brand'] = {{DL - ecommerce.click}}['products'][0].brand;
    ecommData['Product Category'] = {{DL - ecommerce.click}}['products'][0].category;
    ecommData['Product Name'] = {{DL - ecommerce.click}}['products'][0].name;
    return ecommData;
  }
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, productClickData());
</script>
```
## TreasureData - Ecomm Tag - Product Impression

Calls TreasureData `trackEvent` to record product impressions and passes in `ecommData`.

Triggers on: **eecImpression**

```html
<script>
  var productImpressionData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'product impression';
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Product ID'] = {{DL - ecommerce.impressions}}[0].id;
    ecommData['Product Brand'] = {{DL - ecommerce.impressions}}[0].brand;
    ecommData['Product Category'] = {{DL - ecommerce.impressions}}[0].category;
    ecommData['Product Name'] = {{DL - ecommerce.impressions}}[0].name;
    return ecommData;
  }
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, productImpressionData());
</script>
```

## TreasureData - Ecomm Tag - Add to Cart
Calls TreasureData `trackEvent` to record add to carts and passes in `ecommData`.

Triggers on: **eecAddToCart**

```html
<script>
  var addToCartData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'add to cart';
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Product ID'] = {{DL - ecommerce.add}}['products'][0].id;
    ecommData['Product Brand'] = {{DL - ecommerce.add}}['products'][0].brand;
    ecommData['Product Category'] = {{DL - ecommerce.add}}['products'][0].category;
    ecommData['Product Quantity'] = {{DL - ecommerce.add}}['products'][0].quantity;
    ecommData['Product Price'] = {{DL - ecommerce.add}}['products'][0].price;
    ecommData['Product Name'] = {{DL - ecommerce.add}}['products'][0].name;
    return ecommData;
  }
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, addToCartData());
</script>
```

## TreasureData - Ecomm Tag - Remove from Cart
Calls TreasureData `trackEvent` to record remove from carts and passes in `ecommData`.

Triggers on: **eecRemoveFromCart**

```html
<script>
  var removeFromCartData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'remove from cart';
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Product ID'] = {{DL - ecommerce.remove}}['products'][0].id;
    ecommData['Product Brand'] = {{DL - ecommerce.remove}}['products'][0].brand;
    ecommData['Product Category'] = {{DL - ecommerce.remove}}['products'][0].category;
    ecommData['Product Quantity'] = {{DL - ecommerce.remove}}['products'][0].quantity;
    ecommData['Product Price'] = {{DL - ecommerce.remove}}['products'][0].price;
    ecommData['Product Name'] = {{DL - ecommerce.remove}}['products'][0].name;
    return ecommData;
  }
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, removeFromCartData());
</script>
```
## TreasureData - Ecomm Tag - Check out
Calls TreasureData `trackEvent` to record checkouts and passes in `ecommData`. Also sends user's email and communication permissions (newsletter or marketing) during checkout for targeting purposes. Triggers on `eecCheckout` OR `Trigger Group (CE - eecCheckout && Window Loaded - All Pages)` in the event that `eecCheckout` fires before the TreasureData SDK loads. 

Triggers on: **eecCheckout** OR **Trigger Group (CE - eecCheckout && Window Loaded - All Pages)**.

```html
<script>
  var checkoutData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'check out' + ' - ' + {{DL - ecommerce.checkout}}['actionField']['option'];
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Checkout Name'] = {{DL - ecommerce.checkout}}['actionField']['option'];
    ecommData['Checkout Step'] = {{DL - ecommerce.checkout}}['actionField']['step'];
    ecommData['Checkout Products'] = {{DL - ecommerce.checkout}}['products'];
    ecommData['Email'] = {{DL - ecommerce.checkout}}['email'];
    ecommData['Newsletter Permissions'] = {{DL - ecommerce.checkout.newsletter_permissions}};
    ecommData['Marketing Permissions'] = {{DL - ecommerce.checkout.marketing_permissions}};
    return ecommData
  }
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, checkoutData());
</script>
```

## TreasureData - Ecomm Tag - Purchase
Calls TreasureData `trackEvent` to record purchases and passes in `ecommData`.

Triggers on: **CE - transaction Events** OR **Trigger Group (CE - transaction events && Window Loaded - All Pages)**.

```html
<script>
  var purchaseData = function() {
    var ecommData = {};
  
    ecommData['Event Name'] = 'purchase';
    ecommData['Cart ID'] = {{DL - ecommerce}}.cartId;
    ecommData['Order ID'] = {{DL - ecommerce.purchase}}['actionField']['id'];
    ecommData['Revenue'] = {{DL - ecommerce.purchase}}['actionField']['revenue'];
    ecommData['Tax'] = {{DL - ecommerce.purchase}}['actionField']['tax'];
    ecommData['Shipping'] = {{DL - ecommerce.purchase}}['actionField']['shipping'];
    ecommData['Purchase Products'] = {{DL - ecommerce.purchase}}['products'];
    return ecommData;
  }  
  td.trackEvent({{LT - TreasureData Ecom Events Table}}, purchaseData());
</script>
```

# Triggers

## Product Clicks

Fires when a product click occurs

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `eecClick` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Product Impressions

Fires when a product impression occurs

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `eecImpression` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Product Add to Cart

Fires when a product is added to cart

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `ecAddToCart` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Product Remove from Cart

Fires when a product is removed from cart

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `eecRemoveFromCart` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Checkout

Fires when a checkout occurs

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | `eecCheckout` |
| Use regex matching    | No                |
| This trigger fires on | All Custom Events |

## Purchase

Fires when a purchase occurs

| Property              | Value             |
| --------------------- | ----------------- |
| Trigger Type          | Custom event      |
| Event Name            | CE - transaction Events |
| Use regex matching    | Yes                |
| This trigger fires on | All Custom Events |


# Variables

## LT - TreasureData Ecom Events Table

Regex lookup table of TreasureData ecom events table to store values. Looks at {{Page URL}} to determine which value should be outputted.

| Property      | Value                 |
| ------------- | --------------------- |
| Variable Type | Regex Table              |

## dataLayer Variables
| Variable      | Description|
| ------------- | --------------------- |
|ecommerce | thee entire ecommerce object and is the parent object of all nested ecommerce objects (e.g. add, remove, checkout) |
|ecommerce.click | the ecommerce click object |
|ecommerce.impressions |the ecommerce impressions |
|ecommerce.add | the ecommerce add to cart object |
|ecommerce.remove |the ecommerce remove from cart object |
|ecommerce.checkout |the ecommerce checkout object |
|ecommerce.email | the ecommerce checkout.email variable|
|ecommerce.checkout.marketing_permissions |the ecommerce checkout.marketing_permissions variable and is et when a user agrees to marketing communications|
|ecommerce.checkout.newsletter_permissions |the ecommerce checkout.newsletter_permissions variable and is set when a user agrees to newsletter communications|
|ecommerce.purchase|the ecommerce purchase object|
