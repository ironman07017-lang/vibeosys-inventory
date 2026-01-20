Vibeosys Inventory Frontend Assignment

Git repository:
https://github.com/ironman07017-lang/vibeosys-inventory.git

About the project
-----------------
This is a single page application (SPA) built with React and Vite.
It manages products for a manufacturing unit in Pune and their raw materials.

Features
--------
- Products list page:
  - Shows product name, category, total cost and number of raw materials
  - Product name is clickable to open the edit page
  - Search by product name or category
  - Delete product

- Add / Edit product page:
  - Enter product name, unit of measure, category and expiry date
  - Add multiple raw materials with unit, quantity and price
  - Automatically calculates:
    - Total price (quantity * unit price)
    - Tax at 10% of the total price
    - Total amount (price + tax)
  - Shows total cost of the product (sum of all materials) and material count

Tech stack
----------
- React (SPA)
- Vite (build tool)
- Tailwind CSS for styling
- Font Awesome for icons
- useReducer for state management (Redux-style, as recommended)

How to run
----------
1. Clone the repository:
   git clone https://github.com/ironman07017-lang/vibeosys-inventory.git

2. Go into the project folder:
   cd vibeosys-inventory

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open the URL shown in the terminal (usually http://localhost:5173)

Notes
-----
- This is a standalone frontend application.
- It does not call any APIs and works completely in the browser.
