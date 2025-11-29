import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, User, Building, MapPin, Phone } from 'lucide-react';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    address: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Sync formData with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
        address: user.address || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Basic validation
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match");
      setIsUpdating(false);
      return;
    }

    try {
      const response = await userService.updateProfile(formData);

      if (response.data.emailChangePending) {
        toast.success("Please check your new email to confirm the change.");
        // Clear sensitive fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      } else {
        // Update user in context
        if (response.data.user) {
          updateUser(response.data.user);
        } else {
          updateUser({ ...user, ...formData });
        }
        toast.success('Profile updated successfully');
        // Clear sensitive fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      }

    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!user) return false;
    // Check standard fields
    const standardFieldsChanged =
      formData.name !== (user.name || '') ||
      formData.businessName !== (user.businessName || '') ||
      formData.address !== (user.address || '') ||
      formData.phone !== (user.phone || '');

    // Check security fields
    const securityFieldsChanged =
      formData.email !== (user.email || '') ||
      formData.newPassword !== '' ||
      formData.confirmNewPassword !== '';

    return standardFieldsChanged || securityFieldsChanged;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">
            Manage your personal and business information
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Profile Information
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Last updated: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
              </p>
            </div>

            {hasUnsavedChanges() && (
              <div className="flex items-center px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <Loader2 className="w-4 h-4 text-amber-600 mr-2 animate-spin" />
                <span className="text-sm font-medium text-amber-700">
                  Unsaved changes
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="p-6 space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-6 bg-blue-900 rounded-full"></div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h4>
              </div>

              {/* Full Name */}
              <InputField
                label="Full Name"
                name="name"
                icon={User}
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Business Information Section */}
            <div className="pt-8 border-t border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 bg-blue-900 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Business Information
                  </h4>
                </div>

                <p className="text-sm text-slate-600">
                  This information will be used to pre-fill the "Bill From" section of your invoices
                </p>

                <div className="space-y-6">
                  <InputField
                    label="Business Name"
                    name="businessName"
                    icon={Building}
                    type="text"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Company LLC"
                  />

                  <TextareaField
                    label="Business Address"
                    name="address"
                    icon={MapPin}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, City, ZIP Code"
                    rows={3}
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    icon={Phone}
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings Section */}
            <div className="pt-8 border-t border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Security Settings
                  </h4>
                </div>

                <p className="text-sm text-slate-600">
                  Update your password or email. <strong>Current password is required for these changes.</strong>
                </p>

                <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <InputField
                    label="Email Address"
                    name="email"
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="new@email.com"
                  />

                  <div className="border-t border-slate-200 my-4"></div>

                  <InputField
                    label="Current Password (Required for security changes)"
                    name="currentPassword"
                    icon={User}
                    type="password"
                    value={formData.currentPassword || ''}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="New Password"
                      name="newPassword"
                      icon={User}
                      type="password"
                      value={formData.newPassword || ''}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current"
                    />
                    <InputField
                      label="Confirm New Password"
                      name="confirmNewPassword"
                      icon={User}
                      type="password"
                      value={formData.confirmNewPassword || ''}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Button */}
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!hasUnsavedChanges()}
                size="medium"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-900">Security</h4>
          </div>
          <p className="text-sm text-slate-600">
            Your information is secured and encrypted
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-900">Sync</h4>
          </div>
          <p className="text-sm text-slate-600">
            Changes are applied instantly across all features
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-900">Invoicing</h4>
          </div>
          <p className="text-sm text-slate-600">
            Used to automatically generate your invoices
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;