import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { NovusInput } from './Novus-MUI-wrappers';
import NovusButton from './Novus-MUI-wrappers/NovusButton';
import NovusToggle from './Novus-MUI-wrappers/NovusToggle';
import ShimmerLoader from './commmon/ShimmerLoader';

import DeleteIcon from '@mui/icons-material/Delete';

interface CartToggleOption {
  key: string;
  display: string;
  value: boolean;
}


const CartSettingsRemote = ({
  fetchAppFeatures,
  fetchAppConfig,
  updateAppFeatures,
  saveCartSettings,
}: any) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [initialState, setInitialState] = useState({});

  const [options, setOptions] = useState<CartToggleOption[]>([]);
  const [cartConfig, setCartConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic Configuration');

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const basicConfigRef = useRef<HTMLDivElement>(null);
  const deliveryChargesRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement>, tab: string) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [features, config] = await Promise.all([
        fetchAppFeatures(),
        fetchAppConfig(),
      ]);

      const cartFeatures = features.feature?.cart ?? {};

      setOptions([
        { key: 'gst_input', display: 'Allow GST number', value: cartFeatures.gst_input ?? false },
        { key: 'staff_selection', display: 'Display staff selection', value: cartFeatures.staff_selection ?? false },
        { key: 'placing_for_customer', display: 'Placing order for customer', value: cartFeatures.placing_for_customer ?? false },
        { key: 'google_map', display: 'Address Google Map', value: cartFeatures.google_map ?? false }
      ]);

      setCartConfig(config.cart);

      setInitialState({
        options: JSON.stringify([
          cartFeatures.gst_input,
          cartFeatures.staff_selection,
          cartFeatures.placing_for_customer,
          cartFeatures.google_map
        ]),
        config: JSON.stringify(config.cart)
      });
    } catch (err) {
      setMessage('❌ Failed to load settings');
      console.error('[CartSettings] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAppFeatures, fetchAppConfig]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleOptionToggle = (index: number) => {
    const updated = [...options];
    updated[index].value = !updated[index].value;
    setOptions(updated);
  };

  const handleCartChange = (path: string, value: number | boolean | any[]) => {
    setCartConfig(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let obj = updated;
      while (keys.length > 1) {
        const key = keys.shift();
        obj[key] = { ...obj[key] };
        obj = obj[key];
      }
      obj[keys[0]] = value;
      return updated;
    });
  };

  const validate = () => {

    if (!cartConfig) return false;

    const newErrors = {};
    const num = /^[0-9]\d*$/;
    if (cartConfig.pan_card.enabled) {
      if (!num.test(cartConfig.pan_card.cod_threshold_amount)) {
        newErrors.cod_threshold_amount = 'Invalid COD threshold';
      }
      if (!num.test(cartConfig.pan_card.online_threshold_amount)) {
        newErrors.online_threshold_amount = 'Invalid Online threshold';
      }
    }
    if (!num.test(cartConfig.max_cart_items)) {
      newErrors.max_cart_items = 'Invalid max cart items';
    }
    if (isNaN(cartConfig.min_cart_value) || cartConfig.min_cart_value < 0) {
      newErrors.min_cart_value = 'Invalid min cart value';
    }
    cartConfig.delivery_charges.charges.forEach((item: { threshold: string; charges: string; }, idx: any) => {
      if (!num.test(item.threshold) || !num.test(item.charges)) {
        newErrors[`delivery_${idx}`] = 'Invalid delivery charge row';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(cartConfig) !== initialState.config ||
      JSON.stringify(options.map(o => o.value)) !== initialState.options
    );
  }, [cartConfig, options, initialState]);

  const handleSave = async () => {
    if (!validate()) {
      setMessage('❌ Fix validation errors');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const featurePayload = {
        cart: options.reduce((acc, opt) => {
          acc[opt.key] = opt.value;
          return acc;
        }, {})
      };
      await Promise.all([
        updateAppFeatures(featurePayload),
        saveCartSettings({ cart: cartConfig })
      ]);
      setMessage('✅ Settings saved successfully');
      setSnackbarOpen(true);
      setInitialState({
        options: JSON.stringify(options.map(o => o.value)),
        config: JSON.stringify(cartConfig)
      });
    } catch (err) {
      console.error('[CartSettings] Save failed', err);
      setMessage('❌ Save failed');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const addDeliveryCharge = () => {
    setCartConfig(prev => ({
      ...prev,
      delivery_charges: {
        ...prev.delivery_charges,
        charges: [...prev.delivery_charges.charges, { threshold: 0, charges: 0 }]
      }
    }));
  };

  const removeDeliveryCharge = (index: number) => {
    setCartConfig(prev => {
      const charges = [...prev.delivery_charges.charges];
      charges.splice(index, 1);
      return {
        ...prev,
        delivery_charges: {
          ...prev.delivery_charges,
          charges
        }
      };
    });
  };

  if (loading || !cartConfig) return <ShimmerLoader height="200px" />;

  return (
    <Box>
      {/* Header */}
      <Box
        bgcolor="#ffffff"
        boxShadow="0 1px 0px 0 rgba(0,0,0,0.1)"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={2}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Typography variant="h6" fontWeight={600}>Cart</Typography>
        <NovusButton
          novusColor="default"
          disabled={saving || !isDirty}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save'}

        </NovusButton>
      </Box>

      <Box display="flex" minHeight="calc(100vh - 64px)">
        {/* Sidebar */}
        <Box
          minWidth="240px"
          p={2}
          position="sticky"
          top={64}
          height="calc(100vh - 64px)"
        >
          <Box
            bgcolor="#ffffff"
            borderRadius="8px"
            boxShadow="0 0 0 1px rgba(0,0,0,0.05)"
            display="flex"
            flexDirection="column"
          >
            {[{ label: 'Basic Configuration', ref: basicConfigRef }, { label: 'Delivery Charges', ref: deliveryChargesRef }].map((item, index) => (
              <Box
                key={index}
                px={3}
                py={2}
                borderLeft="4px solid transparent"
                sx={{
                  cursor: 'pointer',
                  backgroundColor: activeTab === item.label ? '#f5f8ff' : 'transparent',
                  color: activeTab === item.label ? '#3f51b5' : '#333',
                  fontWeight: activeTab === item.label ? 600 : 400,
                  borderLeftColor: activeTab === item.label ? '#3f51b5' : 'transparent',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => scrollTo(item.ref, item.label)}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box flex={1} display={'flex'} flexDirection={'column'} gap={2} p={2} sx={{ scrollBehavior: 'smooth' }} ref={contentContainerRef}>
          {/* Basic Configuration */}
          <Box
            ref={basicConfigRef}
            bgcolor="white"
            borderRadius="12px"
            boxShadow="0 1px 3px rgba(0,0,0,0.08)"
            p={4}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>Basic Configuration</Typography>

            {options.map((opt, idx) => (
              <Box
                key={opt.key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                borderBottom="1px solid #eee"
              >
                <Typography>{opt.display}</Typography>
                <NovusToggle
                  checked={opt.value}
                  onChange={() => handleOptionToggle(idx)} />

              </Box>
            ))}

            <Box display="flex" justifyContent="space-between" alignItems="center" py={1}
              borderBottom="1px solid #eee">
              <Typography>Allow coupon with rewards</Typography>
              <NovusToggle
                checked={cartConfig.revenue_engine_coupon}
                onChange={(e) => handleCartChange('revenue_engine_coupon', e.target.checked)}
              />

            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" py={1}
              borderBottom="1px solid #eee"
            >
              <Typography>Ask for PAN card details on checkout</Typography>
              <NovusToggle
                checked={cartConfig.pan_card.enabled}
                onChange={(e) => handleCartChange('pan_card.enabled', e.target.checked)}
              />
            </Box>

            {cartConfig.pan_card.enabled && (
              <>
                <NovusInput
                  label="PAN card required min cart COD checkout value"
                  type="number"
                  value={cartConfig.pan_card.cod_threshold_amount}
                  onChange={(e) => handleCartChange('pan_card.cod_threshold_amount', parseInt(e.target.value, 10))}
                  variantType={errors.cod_threshold_amount ? 'error' : 'default'}
                  helperText={errors.cod_threshold_amount}
                  novusSize="m"
                />
                <NovusInput
                  label="PAN card required min cart Online checkout value"
                  type="number"
                  value={cartConfig.pan_card.online_threshold_amount}
                  onChange={(e) => handleCartChange('pan_card.online_threshold_amount', parseInt(e.target.value, 10))}
                  variantType={errors.online_threshold_amount ? 'error' : 'default'}
                  helperText={errors.online_threshold_amount}
                  novusSize="m"
                />
              </>
            )}

            <NovusInput
              label="Max Cart Items"
              type="number"
              value={cartConfig.max_cart_items}
              onChange={(e) => handleCartChange('max_cart_items', parseInt(e.target.value, 10))}
              variantType={errors.max_cart_items ? 'error' : 'default'}
              helperText={errors.max_cart_items}
              novusSize="m"
            />
            <NovusInput
              label="Min Cart Value"
              type="number"
              value={cartConfig.min_cart_value}
              onChange={(e) => handleCartChange('min_cart_value', parseInt(e.target.value, 10))}
              variantType={errors.min_cart_value ? 'error' : 'default'}
              helperText={errors.min_cart_value}
              novusSize="m"
            />
          </Box>

          {/* Delivery Charges */}
          <Box
            ref={deliveryChargesRef}
            bgcolor="white"
            borderRadius="12px"
            boxShadow="0 1px 3px rgba(0,0,0,0.08)"
            p={4}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>Delivery Charges</Typography>

            <Box mt={1} display="flex" flexDirection="column" gap={2}>
              {cartConfig.delivery_charges.charges.map((row, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                  justifyContent="flex-start"
                >
                  <Box sx={{ width: '180px' }}>
                    <NovusInput
                      label="Threshold"
                      type="number"
                      value={row.threshold}
                      onChange={(e) => {
                        const updated = [...cartConfig.delivery_charges.charges];
                        updated[idx].threshold = parseInt(e.target.value, 10);
                        handleCartChange('delivery_charges.charges', updated);
                      }}
                      novusSize="m"
                    />
                  </Box>

                  <Box sx={{ width: '180px' }}>
                    <NovusInput
                      label="Charges"
                      type="number"
                      value={row.charges}
                      onChange={(e) => {
                        const updated = [...cartConfig.delivery_charges.charges];
                        updated[idx].charges = parseInt(e.target.value, 10);
                        handleCartChange('delivery_charges.charges', updated);
                      }}
                      novusSize="m"
                    />
                  </Box>

                  <IconButton onClick={() => removeDeliveryCharge(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box mt={2}>
              <NovusButton onClick={addDeliveryCharge}>Add Delivery Charge</NovusButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={message.startsWith('✅') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default CartSettingsRemote;
