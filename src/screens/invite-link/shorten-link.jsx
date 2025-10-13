import React from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import { icon } from "../../components/assets/assets";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import WarningToast from "../../components/toasts/warning-toast";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";

const ShortenLink = ({
  inviteInfo,
  customLink,
  setCustomLink,
  createLinkHandler,
  isCustomLinkGenerated,
}) => {
  const handleCopy = () => {
    if (!customLink.customEditLink) {
      ErrorToast("No link available. Please generate a link first!");
      return;
    }
    navigator.clipboard.writeText(customLink.customEditLink);
    SuccessToast("Link copied to clipboard!");
  };

  const iconArray = [
    {
      iconSrc: "publicCopyIcon",
      tooltip: "Copy Link",
      onclick: () => handleCopy(),
    },
    /* {
      iconSrc: "publicShareIcon",
      tooltip: 'Share Link',
      onclick: () => {

      }
    },
    {
      iconSrc: "publicHostingIcon",
      tooltip: 'Hosting Link',
      onclick: () => {

      }
    },
    {
      iconSrc: "publicEditIcon",
      tooltip: 'Edit Link',
      onclick: () => {

      }
    }, */
    {
      iconSrc: "publicQRCodeIcon",
      tooltip: "QR Code Link",
      onclick: () => {},
    },
  ];

  return (
    <div className="row">
      <NormalInputField
        divTagCssClasses={`col input-field xl12 l12 m12 s12 copy-code`}
        labelText="Interview link"
        value={inviteInfo.linkValue}
        disabled={true}
        style={{ backgroundColor: "#fff" }}
      />

      <NormalInputField
        divTagCssClasses="col input-field xl6 l6 m6 s6 copy-code"
        labelText="Shorten Link"
        value={inviteInfo.shortenLink}
        disabled={true}
        style={{ backgroundColor: "#fff" }}
      />

      <NormalInputField
        divTagCssClasses="col input-field xl6 l6 m6 s6 copy-code"
        labelText="Custom Edit Here"
        placeholder="Custom Edit Here"
        value={customLink.customEditLink}
        onChange={(e) => {
          const fixedPrefix = "https://app.evueme.live/";
          let newValue = e.target.value;
          if (!newValue.startsWith(fixedPrefix)) {
            WarningToast("The link must start with 'https://app.evueme.live/'");
          } else {
            const customPart = newValue.slice(fixedPrefix.length);
            setCustomLink({
              ...customLink,
              customEditLink: fixedPrefix + customPart,
            });
          }
        }}
        labelIconSrc={icon.editBoxIcon}
      />

      <NormalInputField
        divTagCssClasses="col input-field xl12 l12 m12 s12 copy-code"
        labelText="Shortened Interview Link Title"
        placeholder="Shortened Interview Link Title"
        value={customLink.shortenedInterviewLinkTitle}
        onChange={(e) =>
          setCustomLink({
            ...customLink,
            shortenedInterviewLinkTitle: e.target.value,
          })
        }
        labelIconSrc={icon.editBoxIcon}
      />

      <div className="col m12 mb10">
        <NormalButton
          buttonTagCssClasses="btn btn-clear btn-submit btn-small btnsmall-tr right"
          buttonText={"Create Link Now"}
          onClick={createLinkHandler}
        />
      </div>
      <div className="col m6">
        {isCustomLinkGenerated && (
          <p className="evueme-ai custom-link">{customLink.customEditLink}</p>
        )}
      </div>
      <div className="col m6">
        <ul className="sharelinkico">
          {iconArray.map(({ iconSrc, tooltip, onclick }, index) => {
            return (
              <li key={index}>
                <a
                  href="#"
                  class="tooltipped"
                  data-position="top"
                  data-tooltip={tooltip}
                  onClick={(e) => {
                    e.preventDefault();
                    onclick();
                  }}
                >
                  <i>
                    <EvuemeImageTag src={icon[iconSrc]} alt="" />
                  </i>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ShortenLink;
