import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from "express";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send(req.body)
  } );
  
  function isValidImage(url: string) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  app.get("/filteredimage", async (req:Request, res:Response) => {
    if (!req.query["image_url"]) {
      res.status(400).send("Image URL is empty!!!");
    } else if (!isValidImage(req.query["image_url"])) {
      res.status(422).send("Image URL is invalid!!!");
    } else {
      try {
          const filter_image = await filterImageFromURL(req.query["image_url"]);
          res.status(200).sendFile(filter_image, () => {
            deleteLocalFiles([filter_image]);
          });
    }
    catch(e){
        res.status(500).send("Cannot complete API call!!!");
    }
    } 
  });

  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();