import React,{useState,useEffect} from 'react'
import { useHistory, useLocation } from "react-router-dom"
import { login } from '../../context/user_context.js'
import Message from '../../components/message.js'
import Loading from '../../components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { createProductReview } from '../../context/product_context_admin'
import { PRODUCT_CREATE_REVIEW_RESET } from '../../actions'
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';



function Rate({ open, onClose,productID }) {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch()
    const [rate, setRate] = useState(2)
    const [comment, setComment] = useState('')
    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate
    useEffect(() => {
        if (successProductReview) {
            setRate(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
    }, [dispatch, successProductReview])
    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin
    const buttonAction = () => {
        const review = {
            'rating':rate,
            'comment': comment
        }
        dispatch(createProductReview(productID,review))
      }
    return open && (
        <div >
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className="overlay"></div>
            
            <div className="rate-container margin-up margin-down wide">
                <div style={{ display: "flex" }}>
                    <button onClick={onClose} className="borderless"><i class="fa fa-times-circle fa-2x"></i></button>
                    <div className="refund-header-container">
                        <h1> Rate </h1>
                    </div>
                </div>
                {loading ? <Loading /> :
                    <form className="login-form whole">
                        {error && <Message variant='danger'>{error}</Message>}
                        <div className="login-input-box">
                            <span className="register-details">Score</span>

                            <Rating
                                name="customized-empty"
                                defaultValue={2}
                                precision={0.5}
                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />

                        </div>
                        <div className="login-input-box">
                            <span className="register-details">Comments </span>
                            <textarea type="text" name="username"  value={comment} onChange = {(e) => setComment(e.target.value)}/>
                        </div>
                        <div className="whole center" style={{ display: Table }}>
                            {userLogin && <button onClick={buttonAction}> Post </button>}
                        </div>
                    </form>
                }
            </div>
        </div>)
}

export default Rate