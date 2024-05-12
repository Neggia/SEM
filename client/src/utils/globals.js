const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const HTML_ELEMENT_TYPE_UNKNOWN = 0;
const HTML_ELEMENT_TYPE_PRODUCT = 1;
const HTML_ELEMENT_TYPE_CATEGORY = 2;
const HTML_ELEMENT_TYPE_PAGINATION = 3;
const HTML_ELEMENT_TYPE_INFINITE_SCROLLING = 4;

const CONTROLLER_FIXTURES_ID = 'fixtures';
const CONTROLLER_FIXTURES_SYNC = '/sync';

const CONTROLLER_SERVICE_OPENAI_ID = 'service-openai';
const CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE = 'get-product-structure';
const CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS = 'get-functions';

const CONTROLLER_OPENAI_COMPLETIONS_ID = 'openai-completions';
const CONTROLLER_OPENAI_COMPLETIONS_SYNC = '/sync';

const CONTROLLER_HTML_ELEMENT_STRUCTURE_ID = 'html-element-structure';
const CONTROLLER_HTML_ELEMENT_STRUCTURE_SYNC = '/sync';

const CONTROLLER_PROCESS_ID = 'process';
const CONTROLLER_PROCESS_SYNC = '/sync';

const PROCESS_STATUS_RUNNING = 1; // 2^0, binary 0001
const PROCESS_STATUS_PAUSED = 2; // 2^1, binary 0010
const PROCESS_STATUS_STOPPED = 4; // 2^2, binary 0100
const PROCESS_STATUS_ERROR = 8; // 2^3, binary 1000

const CONTROLLER_WEBSITE_ID = 'website';
const CONTROLLER_WEBSITE_SYNC = '/sync';

const WEBSITE_STATUS_RUNNING = 1; // 2^0, binary 0001
const WEBSITE_STATUS_PAUSED = 2; // 2^1, binary 0010
const WEBSITE_STATUS_STOPPED = 4; // 2^2, binary 0100
const WEBSITE_STATUS_ERROR = 8; // 2^3, binary 1000

const CONTROLLER_PRODUCT_ID = 'product';
const CONTROLLER_PRODUCT_TITLE = '/title';

const CONTROLLER_CURRENCY_ID = 'currency';

const CONTROLLER_CATEGORY_ID = 'category';

const VIEW_PRODUCT_ITEMS_PER_PAGE = 24;
const VIEW_PRODUCT_SEARCH_TITLES_LIMIT = 5;

const CLASS_ICON_BUTTON_PRESSED = 'icon-button-pressed';
const CLASS_ICON_BUTTON_NOT_PRESSED = 'icon-button';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}

function arrayToDataUrl(array, mimeType = 'image/jpeg') {
  if (!array || array.length === 0) {
    // Return null or a default image URL
    // return null; // or return 'path/to/default/image.jpg';
    return 'image_not_found.png';
  }

  const buffer = new Uint8Array(array);
  // const base64String = buffer.toString('base64');
  const base64String = arrayBufferToBase64(buffer);
  return `data:${mimeType};base64,${base64String}`; // Adjust the MIME type if necessary

  // const blob = new Blob([buffer], { type: mimeType });
  // return URL.createObjectURL(blob);
}

function displayFlashMessage(message, messageType, flashMessageDivId) {
  const flashMessageDiv = document.getElementById(flashMessageDivId);
  flashMessageDiv.textContent = message;

  // Clear previous message types
  flashMessageDiv.classList.remove('success', 'error');

  // Add the appropriate class based on the message type
  if (messageType === 'success') {
    flashMessageDiv.classList.add('success');
  } else if (messageType === 'error') {
    flashMessageDiv.classList.add('error');
  }

  flashMessageDiv.style.display = 'block';

  // Hide the message after a delay
  setTimeout(() => {
    flashMessageDiv.style.display = 'none';
  }, 3000);
}

module.exports = {
  SERVER_BASE_URL,
  HTML_ELEMENT_TYPE_UNKNOWN,
  HTML_ELEMENT_TYPE_PRODUCT,
  HTML_ELEMENT_TYPE_CATEGORY,
  HTML_ELEMENT_TYPE_PAGINATION,
  HTML_ELEMENT_TYPE_INFINITE_SCROLLING,
  CONTROLLER_FIXTURES_ID,
  CONTROLLER_FIXTURES_SYNC,
  CONTROLLER_SERVICE_OPENAI_ID,
  CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE,
  CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS,
  CONTROLLER_OPENAI_COMPLETIONS_ID,
  CONTROLLER_OPENAI_COMPLETIONS_SYNC,
  CONTROLLER_HTML_ELEMENT_STRUCTURE_ID,
  CONTROLLER_HTML_ELEMENT_STRUCTURE_SYNC,
  CONTROLLER_PROCESS_ID,
  CONTROLLER_PROCESS_SYNC,
  PROCESS_STATUS_RUNNING,
  PROCESS_STATUS_PAUSED,
  PROCESS_STATUS_STOPPED,
  PROCESS_STATUS_ERROR,
  CONTROLLER_WEBSITE_ID,
  CONTROLLER_WEBSITE_SYNC,
  WEBSITE_STATUS_RUNNING,
  WEBSITE_STATUS_PAUSED,
  WEBSITE_STATUS_STOPPED,
  WEBSITE_STATUS_ERROR,
  CONTROLLER_PRODUCT_ID,
  CONTROLLER_PRODUCT_TITLE,
  CONTROLLER_CURRENCY_ID,
  CONTROLLER_CATEGORY_ID,
  VIEW_PRODUCT_ITEMS_PER_PAGE,
  VIEW_PRODUCT_SEARCH_TITLES_LIMIT,
  CLASS_ICON_BUTTON_PRESSED,
  CLASS_ICON_BUTTON_NOT_PRESSED,
  arrayToDataUrl,
  displayFlashMessage,
};
