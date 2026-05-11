# jforuflorist Flower Studio Web App Design

Date: 2026-05-11

## Summary

Build a single-page polished catalog web app for **jforuflorist flower studio - Penang Florist**. The app presents a soft Korean/Japanese-inspired floral studio experience with a warmer **Sweet Gifting Mood** direction. Buyers can browse bouquets, flower boxes, and flower baskets, filter by occasion, open a product detail/order form, review order/payment notes, and send a structured WhatsApp order message.

The first version is frontend-only. It does not include an admin panel, backend, inventory system, or online payment gateway.

## Goals

- Create a mobile-friendly florist storefront suitable for buyers coming from Instagram or direct links.
- Make the brand feel warm, gift-focused, gentle, and polished.
- Let buyers quickly find products by category or occasion.
- Generate a complete WhatsApp order message from the selected product and form details.
- Support English and Chinese through a language toggle.
- Keep product, FAQ, notice, and translation content easy to update later.

## Non-Goals

- No payment gateway integration.
- No cart or multi-item checkout.
- No backend order storage.
- No product admin dashboard.
- No direct Instagram scraping or automated use of Instagram images.

## Audience

Primary users are Penang customers ordering flowers for birthdays, graduations, anniversaries, grand openings, condolences, and gifting occasions. The experience should assume many users are on mobile and may want to complete the order through WhatsApp quickly.

## Visual Direction

The chosen visual direction is **Sweet Gifting Mood**:

- Soft, warm, celebratory, and gift-focused.
- Suitable for birthdays, graduations, surprises, and romantic occasions.
- Uses gentle floral imagery, warm light backgrounds, and restrained accents.
- Should still feel like a refined floral studio, not a loud party shop.

When real product photos are available from the shop owner, use them for the hero and product cards. Until then, the app may use clearly replaceable sample imagery.

## Page Structure

The app is a single-page responsive storefront with these main areas:

1. Header
   - Brand name: `jforuflorist flower studio`
   - Location descriptor: `Penang Florist`
   - Navigation: `Home`, `Menu`, `FAQ`, `Order Info`
   - Language toggle: `EN / Chinese`
   - WhatsApp quick action

2. Hero
   - Brand-forward first screen.
   - Warm gifting message and short supporting copy.
   - Primary action to browse the menu.
   - Secondary action to contact/order via WhatsApp.
   - Visual area for floral product or studio imagery.
   - The next menu section should be hinted below the first viewport.

3. Menu
   - Main categories:
     - Bouquets
     - Flower Boxes
     - Flower Baskets
   - Occasion filters:
     - Birthday
     - Graduation
     - Anniversary
     - Grand Opening
     - Condolence
   - Product cards show image, name, description, price/from price, category, occasion tags, and an order button.

4. Product Detail And Order Panel
   - Opens on the same page when a buyer selects a product.
   - Shows product image, name, category, sizes, price/from price, and florist note.
   - Includes the full order form and WhatsApp order action.

5. FAQ
   - Accordion-style questions and answers.
   - Bilingual through language toggle.

6. Order Info And Payment Details
   - Order notice.
   - Delivery note.
   - Temporary sample payment fields for bank transfer, DuitNow/QR, and e-wallet details until real details are provided.
   - Payment should be positioned as information shown before WhatsApp confirmation, not as an automatic checkout.

## Product Data

Products should be represented as structured frontend data with fields such as:

- `id`
- `name`
- `category`
- `occasions`
- `description`
- `priceLabel`
- `sizes`
- `image`
- `floristNote`

Initial sample products should cover bouquets, flower boxes, and flower baskets. Product data should be easy to replace when real product names, prices, and images are provided.

## Order Form

The product detail/order form collects:

- Buyer name
- Buyer phone
- Service type: delivery or pickup
- Quantity
- Pickup or delivery date
- Event time
- Recipient name
- Recipient phone
- Delivery address
- Card message
- Optional special request

Delivery-specific fields can remain visible for simplicity in the first version, or be visually grouped so buyers understand they are mainly for delivery orders.

## WhatsApp Message

The WhatsApp action generates a pre-filled message. The message should be structured and readable:

```text
Hi jforuflorist flower studio, I would like to place an order.

Order Details
Product: [Product Name]
Category: [Category]
Size: [Selected Size]
Quantity: [Quantity]
Service: [Delivery / Pickup]
Pickup/Delivery Date: [Date]
Event Time: [Time]

Buyer Details
Name: [Buyer Name]
Phone: [Buyer Phone]

Recipient / Delivery Details
Recipient Name: [Recipient Name]
Recipient Phone: [Recipient Phone]
Delivery Address: [Address]

Card Message
[Card Message]

Special Request
[Optional Special Request]

Payment Details
I have reviewed the payment details and order notice. Please confirm availability and final total. Thank you.
```

The real WhatsApp number should be configurable. Until provided, use a clearly marked temporary sample number during development.

## FAQ And Policy Content

FAQ questions:

- How early should I place my order?
- What is your flower replacement policy?
- Do you deliver to outstation areas?
- Can the bouquet be left in the car?

Order notice should explain:

- Same-day orders depend on flower availability.
- Flower colors and varieties may be adjusted based on daily stock.
- Payment should be made only after confirmation unless the florist states otherwise.
- Buyers should check card messages carefully before submission.

Delivery note should explain:

- Penang delivery availability and delivery fee confirmation.
- Outstation delivery is not guaranteed and requires manual confirmation.
- Buyers must provide accurate recipient contact and address.
- Flowers should not be left in a hot car.

## Language Support

The app supports English and Chinese through a language toggle. Only one language is shown at a time. All buyer-facing labels, navigation items, product copy, FAQs, order notices, delivery notes, and payment labels should be translatable.

The implementation should centralize copy in translation data rather than scattering text across components.

## Components

Expected component boundaries:

- `Header`: navigation, brand, language toggle, WhatsApp shortcut.
- `Hero`: first-screen brand and primary actions.
- `FilterBar`: category and occasion filters.
- `ProductGrid`: product card layout.
- `ProductCard`: individual product summary.
- `ProductDetailPanel`: selected product details and order form.
- `OrderForm`: buyer and recipient fields.
- `OrderInfo`: order notice, delivery note, payment details.
- `FAQ`: accordion questions.
- `WhatsAppMessageBuilder`: pure utility for building the encoded WhatsApp URL/message.

## Data Flow

- App state stores active language, selected category/filter, selected product, and order form values.
- Product and translation data are read from local structured data.
- Filtering derives the visible product list from category and occasion selections.
- Selecting a product opens the detail/order panel.
- The WhatsApp message builder combines selected product data and form values into an encoded WhatsApp URL.

## Validation And Error Handling

- Required fields should be clearly marked.
- The WhatsApp button should prevent submission or highlight missing required fields when essential information is absent.
- The app should handle empty optional special requests gracefully.
- If the WhatsApp number is still a temporary sample number, the UI should make that clear during development.
- Product image fallbacks should keep layout stable if an image is missing.

## Testing And Verification

Verification should cover:

- Product filters for categories and occasions.
- Language toggle for visible UI text.
- Product detail panel opens with the correct product.
- Required order fields are validated.
- WhatsApp message includes selected product and form data.
- FAQ accordion opens and closes.
- Mobile and desktop layouts remain polished and readable.
- Payment and delivery notes are visible before WhatsApp ordering.

## Open Inputs Needed Before Final Content

- Real WhatsApp phone number.
- Real payment details.
- Real product photos, names, sizes, and prices.
- Final Chinese translations can be refined after the English copy is stable.
