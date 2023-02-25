/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from "react";
import * as R from "ramda";
import copy from "copy-to-clipboard";

import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";

const DisplayPublicAddress = ({ address, text }) => {
  const [copied, setCopied] = useState(false);

  if (R.isEmpty(address) || R.isNil(address)) {
    return null;
  }

  const handleClick = () => {
    copy(address);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const start = R.take(5, address);
  const end = R.takeLast(4, address);
  return (
    <Tooltip
      enterTouchDelay={300}
      placement="bottom"
      title={copied ? "Copied!" : "Copy"}
      arrow
    >
      <Button
        size="large"
        color="info"
        variant="contained"
        color={R.isNil(text) ? "primary" : "secondary"}
        startIcon={<ContentCopyIcon />}
        onClick={handleClick}
        style={{ marginLeft: 10 }}
      >
        {R.isNil(text) ? R.join("…", [start, end]) : text}
      </Button>
    </Tooltip>
  );
};

export default DisplayPublicAddress;
