Below is an example README you can include with your project:

---

# Mini Notion

Mini Notion is a lightweight, browser-based note-taking application inspired by Notion. It allows you to quickly create and manage different types of content blocks such as text, headings, to-do lists, quotes, images, and embedded content (websites or PDFs).

## Features

- **Dynamic Note Blocks**: Create various types of blocks including text, heading, to-do, quote, and embed.
- **Responsive Input**: Auto-expanding textarea with smart adjustments to accommodate text input.
- **Keyboard Shortcuts**: 
  - **Ctrl+1**: Switch to heading mode.
  - **Ctrl+2**: Switch to to-do mode.
- **Slash Commands**: Change block types by typing commands (e.g., `/todo`, `/heading`, `/quote`).
- **Image and Embed Support**: 
  - Upload images directly.
  - Embed external content by providing a URL.
- **Local Storage Persistence**: Your notes are stored in the browser's local storage, ensuring they persist across sessions.
- **Sorting Options**: Easily sort notes by newest, oldest, or alphabetical order.
- **Drag-and-Drop Reordering**: Rearrange notes using the integrated Sortable.js library.

## File Structure

- **`notes.html`**:  
  The main HTML file that lays out the user interface and links the CSS and JavaScript files.  
  citeturn0file0

- **`style1.css`**:  
  Contains styles for the application, ensuring a clean and responsive design.  
  citeturn0file3

- **`script1.js`**:  
  Implements the core functionality, including note creation, editing, sorting, local storage management, auto-resizing of the input area, and keyboard shortcuts.  
  citeturn0file1

- **`sortable.js`**:  
  Integrates the Sortable.js library (loaded via CDN) to provide drag-and-drop reordering of notes.  
  citeturn0file2

## How to Run

1. **Clone or Download the Repository**:  
   Download the project files to your local machine.

2. **Open the Application**:  
   Open the `notes.html` file in your preferred web browser. No additional server setup is required.

3. **Start Using Mini Notion**:  
   - Select a block type from the dropdown.
   - Type your note in the input area.
   - Press **Enter** (without holding Shift) to add the note.
   - Use keyboard shortcuts or slash commands to switch block types quickly.
   - Drag and drop notes to reorder them as needed.

## Customization

- **Styling**:  
  Edit `style1.css` to adjust the appearance of the app, such as colors, fonts, and layout.

- **Functionality**:  
  Modify `script1.js` to extend or change how notes are created, edited, or managed.

## Credits

This project was created with assistance from ChatGPT.

## License

This project is licensed under the MIT License.

---

You can copy and paste this README into a `README.md` file in your repository.
