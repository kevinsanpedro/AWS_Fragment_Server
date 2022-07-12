/* eslint-disable no-undef */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');

module.exports = async (req, res) => {
  try {
    //check if the obj is empty
    if (req.body.length === undefined) {
      throw new Error('not supported');
    }
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-type'),
      size: req.body.length,
    });
    //save the fragment
    await fragment.save();

    //save a raw binary data
    await fragment.setData(req.body);

    //set the location where it will
    //then send a response with fragment meta data
    res
      .set('location', `${process.env.API_URL}/v1/fragments/${fragment.id}`)
      .send(createSuccessResponse({ fragment }));
  } catch (Error) {
    if (Error.message === 'not supported')
      res.status(415).send(createErrorResponse(415, 'Content type is not supported'));
    else res.status(500).send(createErrorResponse(500, Error));
  }
};
