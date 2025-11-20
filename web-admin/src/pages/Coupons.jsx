import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null); // null for create, object for edit

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    percentOff: 0,
    active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/coupons');
      setCoupons(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentCoupon(null);
    setFormData({
      code: '',
      description: '',
      percentOff: 0,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      percentOff: coupon.percentOff,
      active: coupon.active
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCoupon(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCoupon) {
        // Update
        await axios.put(`/admin/coupons/${currentCoupon.id}`, formData);
      } else {
        // Create
        await axios.post('/admin/coupons', formData);
      }
      fetchCoupons();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving coupon:', err);
      alert('Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon');
    }
  };

  if (loading) return <div className="text-text">Loading coupons...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text">Coupons</h2>
        <button 
          onClick={handleOpenCreate}
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          + Create Coupon
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-muted/20">
          <thead className="bg-muted/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-muted/10">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-text">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">{coupon.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-muted">{coupon.percentOff}% Off</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.active ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleOpenEdit(coupon)}
                    className="text-accent hover:text-accent/80 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-muted">No coupons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-surface p-8 rounded-lg shadow-xl w-full max-w-md border border-muted/20">
            <h3 className="text-xl font-bold mb-4 text-text">{currentCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-text text-sm font-bold mb-2" htmlFor="code">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-muted rounded w-full py-2 px-3 text-text bg-transparent leading-tight focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-text text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-muted rounded w-full py-2 px-3 text-text bg-transparent leading-tight focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-text text-sm font-bold mb-2" htmlFor="percentOff">
                  Percent Off
                </label>
                <input
                  type="number"
                  name="percentOff"
                  id="percentOff"
                  value={formData.percentOff}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="shadow appearance-none border border-muted rounded w-full py-2 px-3 text-text bg-transparent leading-tight focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center text-text">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="mr-2 leading-tight"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-muted text-white font-bold py-2 px-4 rounded mr-2 hover:opacity-90 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white font-bold py-2 px-4 rounded hover:opacity-90 focus:outline-none"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
