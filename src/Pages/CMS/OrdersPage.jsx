import React, { useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, getOrders } from '../../Redux/Slice/viewSlice';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Dummy image URL (You can replace this with your SVG logo)
// const logo = 'https://via.placeholder.com/150x50.png?text=Your+Logo';

const SkeletonOrderRow = () => (
  <TableRow>
    <TableCell colSpan={5}>
      <Skeleton variant="rectangular" height={50} />
    </TableCell>
  </TableRow>
);

const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Add your company logo
  // doc.addImage(logo, 'PNG', 10, 10, 50, 20);

  // Add Title
  doc.setFontSize(18);
  doc.text('Invoice', 105, 30, null, null, 'center');

  // Add Order Information
  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 10, 50);
  doc.text(`Date: ${moment(order?.createdAt).format('lll')}`, 10, 60);
  doc.text(`Shipping Address: ${order?.shippingAddress}`, 10, 70);
  doc.text(`Total Amount: Rs.${order?.totalAmount.toFixed(2)}`, 10, 80);

  // Add product table
  const products = order?.orderItems.map(product => ([
    product.name,
    product.quantity,
    `Rs.${product.price}`,
    product.status
  ]));

  doc.autoTable({
    head: [['Product Name', 'Quantity', 'Price', 'Status']],
    body: products,
    startY: 90,
  });

  // Add footer text
  doc.setFontSize(10);
  doc.text('Thank you for shopping with us!', 105, doc.lastAutoTable.finalY + 20, null, null, 'center');

  // Save the PDF
  doc.save(`invoice_${order._id}.pdf`);
};

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.View);

  useEffect(() => {
    dispatch(getCart());
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ my: { lg: 12, md: 10, sm: 10, xs: 8 } }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {loading ? (
              Array.from(new Array(4)).map((_, index) => (
                <SkeletonOrderRow key={index} />
              ))
            ) : (
              orders?.map(order => (
                <>
                  <TableRow key={order?._id}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1">ORDER PLACED</Typography>
                      <Typography>{moment(order?.createdAt).format('lll')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">TOTAL</Typography>
                      <Typography>₹{order?.totalAmount.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">SHIP TO</Typography>
                      <Typography>{order?.shippingAddress}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">ORDER # {order._id}</Typography>
                      <Button variant="text" onClick={() => generateInvoice(order)}>
                        Generate Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell colSpan={5}>
                      <Table>
                        <TableBody>
                          {order?.orderItems.map(product => (
                            <TableRow key={product._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell width="100">
                                <img src={product?.image[0]} alt={product?.name} style={{ width: '100px', borderRadius: '8px' }} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{product?.name}</Typography>
                                <Typography variant="body2">Quantity: {product?.quantity}</Typography>
                                <Typography variant="body2">Price: ₹{product?.price}</Typography>
                                <Typography variant="body2">Status: {product?.status}</Typography>
                                {product?.status === 'Delivered' && (
                                  <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => { navigate(`/order/${product?.productId}/review`) }}>
                                    Write a product review
                                  </Button>
                                )}
                                <Button variant="outlined" color="secondary" sx={{ mt: 1, ml: 1 }} onClick={() => { navigate(`/products/${product?.productId}`) }}>
                                  View Product
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderPage;
