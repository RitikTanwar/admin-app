import { pageConstants } from "./constants"
import axios from '../helpers/axios';

export const createPage=(form)=>{
    return async dispatch=>{
        // console.log(form);
        dispatch({type:pageConstants.CREATE_PAGE_REQUEST});
        try{
            const res=await axios.post('/page/create',form);
            if(res.status===201){
                console.log(res.data);
                dispatch({
                    type:pageConstants.CREATE_PAGE_SUCCESS,
                    payload:{page:res.data.page}
                });
            }
            else{
                dispatch({
                    type:pageConstants.CREATE_PAGE_FAILURE,
                    payload:{erorr:res.data.error}
                })
            }
        }
        catch(error){
            console.log(error);
        }
    }
}