import { updateUserPasswordService } from '../services/index.js';
import { response } from '../utils/index.js';
import { messages } from '../messages/index.js';


export const updateUserPasswordController = async (req, res) => {
  try {
    const { payload } = req.body;

    const result = await updateUserPasswordService(payload);

    if (!result.success) {
      return response(res, {
        statusCode: 400,
        message: result.message || messages.general.BAD_REQUEST,
      });
    }

    return response(res, {
      statusCode: 200,
      message: messages.general.SUCCESS,
      data: result,
    });
  } catch (error) {
    console.error('Error in updateUserPasswordController:', error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
