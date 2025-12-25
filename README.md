# NeuralVault

## Project Overview

NeuralVault is a comprehensive educational resource platform designed to provide students with easy access to academic materials and study notes.

## Key Features

- **Dynamic Content Display:** Built with modern web technologies to provide seamless navigation through educational materials
- **Organized Resource Structure:** Systematically arranged notes and resources by year and subject for easy access
- **JSON-Driven Architecture:** Flexible data management system allowing easy updates and customization of content
- **Interactive Preview System:** Live demonstration platform for exploring available study materials and resources
- **Comprehensive Study Materials:** Wide range of academic notes covering multiple subjects and units

## Contributing

If you encounter any issues or have suggestions for improvement, please feel free to open an issue in this repository.

### Adding PDFs for Notes

To contribute by adding new PDFs, follow these steps:

1. **Rename the PDF:**
   - Name the PDF file using the appropriate subject code and unit name.
   - Example: For "Mathematical Sciences Foundation" Unit 3, name the file as `MSF Unit3.pdf`.

2. **Organize Files:**
   - Place the renamed PDF in the appropriate folder:
     - Path: `public/resources/<year>/`
     - Example: `public/resources/2nd Year/MSF Unit3.pdf`.

3. **Update JSON Files:**
   - Locate the JSON file for the specific subject in `public/info`.
   - Example: For "MSF," find `public/info/MSF.json`.

4. **Add PDF Details:**
   - Update the `links` section in the JSON file with the new PDF name and link.
   - Use the following format:
     ```json
     "links": [
         {
             "name": "MSF Unit 1 Greatest Common Divisors And Prime Factorization And Congruences",
             "link": "./resources/2nd Year/MSF-Unit1.pdf"
         },
         {
             "name": "MSF Unit 2 Simple Linear Regression And Correlation",
             "link": "./resources/2nd Year/MSF-Unit2.pdf"
         },
         {
             "name": "MSF Unit 3 Advanced Number Theory",
             "link": "./resources/2nd Year/MSF-Unit3.pdf"
         }
     ]
     ```

5. **Save and Test:**
   - Ensure the JSON syntax is correct and matches the file structure.
   - Run the application locally or check the live preview to confirm the PDF is displayed correctly.

6. **Commit and Push:**
   - Commit the updated files and push them to the repository.
   - Provide a clear commit message like: `Added MSF Unit3.pdf to 2nd Year and updated MSF.json`.

By following these steps, you can easily contribute to the repository and help expand the available resources.
