import { FC, useState } from 'react';
import RcCopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

export const CopyToClipboard: FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip placement="top" onOpenChange={() => setCopied(false)}>
      <TooltipTrigger>
        <RcCopyToClipboard text={text} onCopy={() => setCopied(true)}>
          <span>
            <i className="fa-regular fa-copy"></i>
          </span>
        </RcCopyToClipboard>
      </TooltipTrigger>
      <TooltipContent>
        <span>{copied ? 'Copied' : 'Copy to clipboard'}</span>
      </TooltipContent>
    </Tooltip>
  );
};
