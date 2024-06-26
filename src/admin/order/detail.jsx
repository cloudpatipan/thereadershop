import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../../components/Layouts/Sidebar';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
export default function DetailOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [tracking_no, setTrackingNo] = useState("");
  const [status, setStatus] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0)

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(`/api/order-detail/${id}`);
      setOrder(response.data);
      setStatus(response.data.status);
      setTrackingNo(response.data.tracking_no);
      setLoading(false);
      calculateTotalPrice(response.data.order_items);
    } catch (error) {
      Swal.fire({
        text: error.response?.data?.message || 'Error fetching order details',
        icon: "error"
      });
    }
  };

  const calculateTotalPrice = (orderItems) => {
    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    setTotalOrderPrice(total);
  };

  const [error, setError] = useState([]);

  const updateOrder = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('tracking_no', tracking_no);
    formData.append('status', status ? 1 : 0);

    axios.post(`/api/orders/${id}`, formData, {
    }).then(response => {
      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
        setError([]);
        navigate("/admin/order");
      } else if (response.data.status === 422) {
        setError(response.data.errors);
        console.log(response.data.errors);
      }
    });
  }


  return (
    <Sidebar>
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="text-3xl font-semibold">กำลังโหลด...</span>
        </div>
      ) : (
        <div className="border p-4 rounded">
          <h1 className="text-2xl font-semibold mb-8">รายการใบสั่งซื้อ</h1>
          <h2 className="text-xl font-semibold">เลขที่ใบสั่งซื้อ {order.order_id}</h2>
          <h3 className="text-lg font-semibold">
            ผู้สั่งซื้อ: {order.user.firstname} {order.user.lastname}
          </h3>
          <table className="w-full overflow-x-scroll">
            <thead>
              <tr className="text-left">
                <th className="py-1 border-b">รหัสสินค้า</th>
                <th className="py-1 border-b">ชื่อสินค้า</th>
                <th className="py-1 border-b">จำนวน</th>
                <th className="py-1 border-b">ราคา</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.length > 0 ? (
                order.order_items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-1 border-b">{item.product.id}</td>
                    <td className="py-1 border-b">{item.product.name}</td>
                    <td className="py-1 border-b">{item.qty}</td>
                    <td className="py-1 border-b">{item.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-1 border-b text-[1.5rem] font-semibold text-center" colSpan={4}>
                    ไม่พบข้อมูลรายการใบสั่งซื้อ
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-4 my-4">

            <div>
              <p className="text-black/40 font-semibold text-lg">ราคารวม <span className="text-black">{totalOrderPrice} บาท</span></p>
            </div>

            <div>
              <p>{order.status === 1 ? "จัดส่งสินค้าเรียบร้อย" : "รอตรวจสอบ"}</p>
            </div>

          </div>
          <div className="w-[10rem] h-[14rem] overflow-hidden rounded-lg">
            {order.payment_image ? (
              <img className="rounded object-cover" src={`https://ef9c-2405-9800-b540-dc40-a46a-cab9-89b-365c.ngrok-free.app/images/payment_image/${order.payment_image}`} alt="" />
            ) : (
              <img className="rounded object-cover" src="https://ef9c-2405-9800-b540-dc40-a46a-cab9-89b-365c.ngrok-free.app/images/product/no_image.png" alt="No Image" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full mt-2">

            <div className="col-span-1 md:col-span-2">
              <label className="text-lg block text-black font-semibold">เลขที่ EMS/เลขที่การจัดส่งสินค้า</label>
              <input
                className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                type="text" placeholder="กรุณาใส่เลขที่ EMS"
                value={tracking_no}
                onChange={(event) => setTrackingNo(event.target.value)}
              />
              <div className="text-red-700 text-sm">{error.name}</div>
            </div>

            <div>
              <label className="text-lg block text-black font-semibold">สถานะ</label>
              <input className="accent-black"
                type="checkbox"
                checked={status}
                onChange={(event) => setStatus(event.target.checked)}
              />
              <div className="text-red-700 text-sm">{error.status}</div>
            </div>

          </div>

          <Button className="w-full" onClick={updateOrder}>
            บันทึก
          </Button>

        </div>
      )}
    </Sidebar>
  );
}
