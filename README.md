#  AIML-sheet

> A comprehensive educational resource platform for students pursuing R22 curriculum

## Project Overview

AIML-sheet is a modern, interactive educational resource platform designed to provide students with seamless access to academic materials, study notes, and comprehensive course resources. Built with clean aesthetics and intuitive navigation, it's your go-to hub for organized learning.

##  Key Features

- ** Dynamic Content Display** - Built with modern web technologies for smooth, responsive navigation
- ** Organized Resource Structure** - Resources systematically arranged by year and subject
- ** JSON-Driven Architecture** - Flexible, easy-to-update data management system
- ** Interactive Preview System** - Live preview and exploration of study materials
- ** Dark Mode Support** - Complete dark theme with persistent preferences
- ** Bookmarking System** - Save and organize your favorite subjects
- ** Smart Search** - Real-time search across all subjects and units
- ** Responsive Design** - Optimized for desktop, tablet, and mobile devices

---

## 🤝 Contributing

We welcome contributions! If you encounter any issues or have suggestions for improvement, please feel free to open an issue in this repository.

### 📄 Adding PDFs for Notes

To contribute by adding new PDF resources, follow these steps:

#### 1. **Rename the PDF**
   - Name the PDF file using the appropriate subject code and unit name
   - Example: For "Mathematical Sciences Foundation" Unit 3, name the file as `MSF Unit3.pdf`

#### 2. **Organize Files**
   - Place the renamed PDF in the appropriate year folder:
   - Path: `public/resources/<year>/`
   - Example: `public/resources/2nd Year/MSF Unit3.pdf`

#### 3. **Update JSON Files**
   - Locate the JSON file for the specific subject in `public/info`
   - Example: For "MSF," find `public/info/MSF.json`

#### 4. **Add PDF Details**
   - Update the `links` section in the JSON file with the new PDF name and link
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

#### 5. **Save and Test**
   - Ensure the JSON syntax is correct and matches the file structure
   - Run the application locally or check the live preview to confirm the PDF displays correctly

#### 6. **Commit and Push**
   - Commit the updated files and push them to the repository
   - Use a clear commit message like: `Added MSF Unit3.pdf to 2nd Year and updated MSF.json`

### 📑 Adding DCS (Document Content System) Files

To contribute by adding DCS or document files, follow these steps:

#### 1. **Prepare the DCS File**
   - Ensure the document is in the correct format (PDF, DOC, DOCX, etc.)
   - Name it using the appropriate subject code and document type
   - Example: `AC-DCS-Unit1.pdf` or `AC-Notes-Unit1.pdf`

#### 2. **Organize Files**
   - Place the DCS file in the appropriate year folder:
   - Path: `public/resources/<year>/dcs/` (create `dcs` folder if it doesn't exist)
   - Example: `public/resources/2nd Year/dcs/AC-DCS-Unit1.pdf`

#### 3. **Update Subject JSON**
   - Locate the JSON file for the specific subject in `public/info`
   - Add a new `dcs_links` section (or update the existing one) with the DCS file details:
   ```json
   "dcs_links": [
       {
           "name": "AC Unit 1 DCS - Digital Circuits",
           "link": "./resources/2nd Year/dcs/AC-DCS-Unit1.pdf"
       },
       {
           "name": "AC Unit 2 DCS - Logic Gates",
           "link": "./resources/2nd Year/dcs/AC-DCS-Unit2.pdf"
       }
   ]
   ```

#### 4. **Verify File Structure**
   - Check that all paths are correct and files exist
   - Ensure JSON syntax is valid
   - Test locally to confirm DCS files are accessible and display correctly

#### 5. **Commit and Push**
   - Commit the updated files with a clear message
   - Example: `Added AC DCS files for Units 1-2 and updated AC.json`

---

By following these steps, you can easily contribute to the repository and help expand the available resources for all learners!
