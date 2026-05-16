# jforuflorist Redesign Design

Date: 2026-05-16

## Summary

Redesign the existing single-page jforuflorist demo into a more attractive premium florist catalog for **jforuflorist flower studio - Penang Florist**. The page should keep the current content and WhatsApp ordering flow, but make the first impression stronger, use uploaded real flower/event images, add an order review step, add About/Contact details, and remove the standalone Order Info section.

The app remains frontend-only and deployable through GitHub Pages.

## Goals

- Make the storefront feel like a polished soft Korean/Japanese floral studio with a sweet gifting mood.
- Use the uploaded shop flower/event photos as demo assets instead of abstract gradient placeholders.
- Keep the catalog simple: bouquets, flower boxes, flower baskets, and occasion filters.
- Add an order review section before opening WhatsApp so buyers can check details first.
- Move order notice, delivery note, and payment guidance into the FAQ/order-help area instead of a standalone Order Info navigation section.
- Add About Us and Contact details:
  - Based in Nibong Tebal | Cameron Highland
  - Phone / WhatsApp: 60162969982
  - SSM: JR0162620-K
- Include a manually curated Instagram-style gallery using uploaded images. True live Instagram sync is out of scope for this frontend-only version.

## Non-Goals

- No backend, CMS, admin panel, product inventory, or payment gateway.
- No Instagram scraping or automatic Instagram live feed in this version.
- No email display for now.
- No multi-item cart checkout.

## Visual Direction

Use the selected **Premium Sweet Boutique** direction:

- Editorial but warm, with a refined gift-shop feel.
- Real floral photography should carry the design.
- Use airy spacing, soft ivory backgrounds, blush accents, restrained borders, and dark readable text.
- Avoid a generic landing page. The first screen should immediately feel like the florist shop and lead into the catalog.
- Keep UI controls compact and useful: filters, order buttons, language toggle, and WhatsApp actions.

## Uploaded Image Use

The uploaded images are located at `C:\Users\60135\Pictures\Flower`.

Implementation should copy selected images into the project under stable asset names, such as `assets/flowers/hero-bouquet.jpeg`, `assets/flowers/product-bouquet-pastel.jpeg`, and `assets/flowers/gallery-event-blue-yellow.jpeg`.

Recommended image mapping:

- Hero: paired bouquet or premium pastel bouquet from the uploaded set.
- Product cards: pastel bouquet, pink bouquet, white bouquet, dark-wrap bouquet, and event/opening setup images.
- Gallery: mix bouquet close-ups, delivered bouquet photos, and blue/yellow event setup photos.
- If one existing sample product has no perfect matching image, use the closest uploaded flower photo and keep the copy broad enough for demo accuracy.

## Page Structure

1. Header
   - Brand: `jforuflorist flower studio`
   - Descriptor: `Penang Florist`
   - Navigation: `Home`, `Menu`, `About`, `Gallery`, `FAQ`
   - Language toggle
   - WhatsApp quick action

2. Hero
   - Large brand-forward first view using real uploaded floral imagery.
   - Copy focuses on soft gifting flowers for birthdays, graduation, openings, anniversaries, and comfort moments.
   - Primary action: browse catalog.
   - Secondary action: WhatsApp.
   - Include concise trust/contact cues such as Penang florist, Nibong Tebal, and WhatsApp ordering.

3. Menu
   - Keep categories and occasion filters.
   - Replace gradient placeholders with real images.
   - Product cards show image, category, name, short copy, price label, and order button.
   - Layout should feel richer than the current plain card grid while staying easy to scan.

4. Product Detail And Order Panel
   - Opens from a product card.
   - Shows selected product image, size options, florist note, and order form.
   - Order form keeps existing fields:
     - Buyer name
     - Buyer phone
     - Service type
     - Quantity
     - Pickup or delivery date
     - Event time
     - Recipient name
     - Recipient phone
     - Delivery address
     - Card message
     - Optional special request
   - Add a visible order review section in the panel.
   - Buyer flow:
     1. Fill order details.
     2. Click `Review order`.
     3. Review selected product and entered details.
     4. Either edit details or send the prefilled WhatsApp message.

5. About Us
   - Short studio introduction.
   - Mention the shop serves soft gifting, bouquets, boxes, baskets, and event arrangements.
   - Show:
     - Based in Nibong Tebal | Cameron Highland
     - WhatsApp / Phone: 60162969982
     - SSM: JR0162620-K

6. Gallery
   - Instagram-inspired manual gallery using uploaded images.
   - Present as a polished visual strip/grid, not as a live feed claim.
   - Can include small labels such as bouquets, event setup, and gifting style.

7. FAQ And Ordering Help
   - Keep existing FAQ questions.
   - Add order notice, delivery note, and payment guidance here.
   - Payment guidance remains sample/confirmation-based until final bank or QR details are provided.
   - The standalone `Order Info` section and navigation item should be removed.

## WhatsApp Number

Set the production demo WhatsApp number to `60162969982`.

All direct WhatsApp links and generated order URLs should use this value. Tests should not assume the old placeholder number.

## Language Support

Keep English and Chinese language toggle. All visible new labels should be translatable:

- About
- Gallery
- Review order
- Edit details
- Send WhatsApp order
- Contact/location/SSM labels
- FAQ/order-help labels

Chinese text should be stored as UTF-8 in source files.

## Components And Data

Keep the current vanilla JavaScript architecture and improve it conservatively:

- `src/data.js`
  - Store contact details, gallery images, and product image paths.
  - Update WhatsApp number.
  - Keep product data structured.

- `src/app.js`
  - Render new sections and revised navigation.
  - Replace `renderOrderInfo` with About, Gallery, and FAQ/order-help rendering.
  - Add order review state and rendering.

- `src/messages.js`
  - Keep validation and WhatsApp message building pure and testable.
  - Support the review-first flow without changing message format unnecessarily.

- `src/styles.css`
  - Redesign layout, hero, product cards, panel, gallery, FAQ, and responsive behavior.

- `index.html`
  - Add/remove section containers to match the new page structure.

## Validation And Testing

Automated tests should cover:

- Product filtering still works.
- Required order validation still works.
- WhatsApp URL uses a cleaned phone number.
- WhatsApp message includes selected product and order details.
- Optional card message and special request still fall back cleanly.
- Contact configuration uses `60162969982`.

Manual browser verification should cover:

- Desktop and mobile layout.
- Header navigation targets.
- Product images render correctly.
- Product panel opens and closes.
- Review step appears before WhatsApp send.
- English/Chinese toggle still updates visible UI.
- FAQ/order-help content appears after removing standalone Order Info.
- GitHub Pages-compatible asset paths.

## Open Inputs

- Final payment details are still not provided.
- Final product names, exact prices, and exact product-photo mapping can be refined later.
- True live Instagram updates require a separate backend/API/widget decision in a future scope.
