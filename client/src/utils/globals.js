const SERVER_BASE_URL = 'http://localhost:3000/';

const CONTROLLER_SERVICE_OPENAI_ID = 'service-openai';
const CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE = 'get-product-structure';
const CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS = 'get-functions';

const CONTROLLER_OPENAI_COMPLETIONS_ID = 'openai-completions';

const CONTROLLER_PROCESS_ID = 'process';
const CONTROLLER_PROCESS_SYNC = '/sync';

const CONTROLLER_WEBSITE_ID = 'website';
const CONTROLLER_WEBSITE_SYNC = '/sync';

const CONTROLLER_PRODUCT_ID = 'product';
const CONTROLLER_PRODUCT_TITLE = '/title';

const CONTROLLER_CURRENCY_ID = 'currency';

const CONTROLLER_CATEGORY_ID = 'category';

const VIEW_PRODUCT_ITEMS_PER_PAGE = 10;
const VIEW_PRODUCT_SEARCH_TITLES_LIMIT = 5;

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
  CONTROLLER_SERVICE_OPENAI_ID,
  CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE,
  CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS,
  CONTROLLER_OPENAI_COMPLETIONS_ID,
  CONTROLLER_PROCESS_ID,
  CONTROLLER_PROCESS_SYNC,
  CONTROLLER_WEBSITE_ID,
  CONTROLLER_WEBSITE_SYNC,
  CONTROLLER_PRODUCT_ID,
  CONTROLLER_PRODUCT_TITLE,
  CONTROLLER_CURRENCY_ID,
  CONTROLLER_CATEGORY_ID,
  VIEW_PRODUCT_ITEMS_PER_PAGE,
  VIEW_PRODUCT_SEARCH_TITLES_LIMIT,
  arrayToDataUrl,
  displayFlashMessage,
};
