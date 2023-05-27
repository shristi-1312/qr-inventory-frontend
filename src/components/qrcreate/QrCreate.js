import React, { useEffect, useState } from 'react'
import "./qrcreate.scss";
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../redux/features/product/productSlice';
import { SpinnerImg } from '../loader/Loader';
import Card from '../card/Card';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/features/auth/authSlice';
import DOMPurify from 'dompurify';
const QRCode = require('qrcode');
const QrCreate = () => {
    useRedirectLoggedOutUser("/login");
    const dispatch = useDispatch();

    const { id } = useParams();
    const [qrcode, setQrCode] = useState('');
    
    const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const generateQr = async () => {
    
       //Convert data to string
       const productData = JSON.stringify(product);
  
       //Generate QR code
       QRCode.toDataURL(productData, (err,url) => {
         if(err) {
           console.error(err);
           return;
         }
         console.log(url);
         setQrCode(url);
  
        //return url;
      })
    }

      useEffect(() => {
        if (isLoggedIn === true) {
          dispatch(getProduct(id));
        }
    
        if (isError) {
          console.log(message);
        }
      }, [isLoggedIn, isError, message, dispatch]);



  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this product</p>
              )}
            </Card>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>&rarr; SKU : </b> {product.sku}
            </p>
            <p>
              <b>&rarr; Category : </b> {product.category}
            </p>
            <p>
              <b>&rarr; Price : </b> {"Rs"}
              {product.price}
            </p>
            <p>
              <b>&rarr; Quantity in stock : </b> {product.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in stock : </b> {"Rs"}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <div>
                  <button className="--btn --btn-primary" onClick={generateQr}>Generate QR</button>
                  {qrcode && <>
                    <img src={qrcode} />
                    <a href={qrcode} download = "qrcode.png">Download</a>

                  </>}
            </div>
            <hr />
            <code className="--color-dark">
              Created on: {product.createdAt.toLocaleString("en-US")}
            </code>
            <br />
            <code className="--color-dark">
              Last Updated: {product.updatedAt.toLocaleString("en-US")}
            </code>
          </div>
        )}
      </Card>
    </div>
  );
}

export default QrCreate