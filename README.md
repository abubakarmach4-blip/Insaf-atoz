You are an expert full-stack web developer and UI/UX designer. Create a complete, single-file, production-ready e-commerce web application for an automotive spare parts and oil shop named "انصاف آٹوز" (Insaf Autos), owned by ابو بکر (Abu Bakr), located at نیو ٹرک اڈہ, مچھ بولان (New Truck Adda, Machh Bolan), with WhatsApp contact 0335 3832032.

Please design the web application with the following core features using HTML, Tailwind CSS (via CDN), and vanilla JavaScript (stored locally in localStorage):

1. UI & Design Theme:
- Luxury dark mode aesthetic with rich gold accents, matching professional automotive and heavy-duty truck spare parts branding.
- Support both Urdu (Nastaliq/Urdu typography friendly) and English labels seamlessly.
- Responsive layout optimized for both mobile phones and desktop screens.

2. Product Catalog & Management:
- Categories: Engine Oil (ایجن آئل), Filters (فلٹرز), Gear Oil (گیئر آئل), Hydraulic Oil (ہائڈرولک), and Polish (پالش).
- Display products in a clean grid with product images, names, categories, and prices in PKR.
- Add New Product form where the shop owner can input details and upload images.

3. Live Camera & Background Removal Tool:
- Include an interactive camera modal/section using HTML5 WebRTC stream (navigator.mediaDevices.getUserMedia).
- Provide a "Capture & Remove Background" button that takes a snapshot from the video stream, processes the canvas to automatically clean/isolate the product object (removing solid light/dark studio backgrounds), and saves the transparent product PNG directly into the new product form.

4. Shopping Cart & WhatsApp Checkout:
- Customers can add products to their cart, adjust quantities, and see total PKR calculations.
- Checkout form requesting Customer Name, Phone Number, and Delivery Address.
- "Send Order to WhatsApp" button that compiles a clean, beautifully formatted order message in Urdu/English and redirects directly to WhatsApp number +923353832032 using the standard wa.me API link.

Ensure the entire application is written in clean, modern, fully functional code within a single HTML file without missing parts or placeholders.
