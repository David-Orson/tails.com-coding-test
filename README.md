# Tails.com Coding Test

## Overview

This project is a response to the coding test provided by Tails.com. The project includes both backend and frontend components, implemented using Flask for the backend and React for the frontend.

## Features

### Backend

- **API Endpoints**:
  - `/api/stores`: Returns a list of stores based on a search query. The results are ordered by matching postcode first and then matching city names.
  - `/api/stores/radius`: Returns a list of stores within a given radius of a given postcode, ordered from north to south.
  - `/api/health`: Health check endpoint.
- **Postcode Caching**: Cached all postcodes from Postcodes.io to improve performance and reduce the number of API requests. The cache is updated every 2 days.
- **Rate Limiting**: Implemented a 50ms rate limit per user ip to prevent abuse of the API but allow the 100ms debounce.
- **Error Handling**: Includes a 404 error handler for not found.
- **Unit Testing**: Focused on the radius endpoint to ensure accurate and reliable results.

### Frontend

- **Search Functionality**: Renders a text field for the query and the list of stores that match it.
- **Debounced Input**: Implemented input debounce with a 100ms delay to improve the user experience.
- **Suggestions**: Displays suggestions as the user types, with a minimum of 2 characters required.
- **Lazy Loading**: Limits the results to 3 and lazy loads the rest on page scroll.
- **Map Integration**: Uses Mapbox to render stores on a map. The selected store is marked on the map.
- **Radius Search**: Allows users to request more stores within a radius of the current store, with results dynamically rendered on the map and ordered north to south. The map zooms to fit all stores within the radius.

## Installation and Setup

### Requirements

To run the map successfully you will need an api key from mapbox.com
Alternatively you can use the application on my [site](https://davidorson.tech)

### Backend

#### Install Dependencies:

```sh
pip install -r requirements.txt
```

#### Run the Flask App (cd to /api/engine):

```sh
python app.py
```

### Frontend

#### Install Dependencies (cd to /client):

```sh
npm install
```

#### Start the React App:

```sh
npm run start
```

## Usage

- Search Stores: Use the search input to find stores by name or postcode. Suggestions will appear as you type.
- View Store on Map: Click on a store from the suggestions to view it on the map.
- Radius Search: Adjust the radius slider and click "Search" to find stores within a specified radius of the selected store. The map will adjust to fit all stores within the radius.

## Testing

Run the tests in the engine directory using the following command:

```sh
python -m unittest test_app.py
```
