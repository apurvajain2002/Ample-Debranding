import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import EvuemeImageTag from '../../components/evueme-html-tags/Evueme-image-tag';
import { icon } from '../../components/assets/assets';
import SuccessToast from '../../components/toasts/success-toast';

const QRCodeGenerator = ({ value, isCopyIcon = false }) => {
  const qrRef = useRef(null);

  const handleCopy = async () => {
    try {
      // Get the QR code canvas element using ref
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) {
        SuccessToast("QR code not found");
        return;
      }

      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });

      // Copy the image to clipboard
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        SuccessToast("QR code image copied to clipboard!");
      } else {
        // Fallback for browsers that don't support clipboard.write
        const dataUrl = canvas.toDataURL('image/png');
        const textArea = document.createElement('textarea');
        textArea.value = dataUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        SuccessToast("QR code image copied to clipboard!");
      }
    } catch (error) {
      console.error('Error copying QR code:', error);
      SuccessToast("Failed to copy QR code image");
    }
  };

  return (
    <div className="qr-code-container" ref={qrRef}>
      <div className="qr-code-header">
        <p style={{ marginBottom: '5px' }}>QR Code</p>
        {isCopyIcon && (
          <div>
            <i className="qr-code-copy-icon carretColor-transparent">
              <EvuemeImageTag
                imgSrc={icon.copyIcon}
                altText={'copy qr code'}
                className={'validate copy-ico'}
                onClick={handleCopy}
              />
            </i>
          </div>
        )}
      </div>
      <QRCodeCanvas value={value} size={100} />
    </div>
  );
};

export default QRCodeGenerator;
