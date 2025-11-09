import { Button } from 'antd';
import React, { useCallback, useMemo } from 'react';

export interface IHelpTextProps {
  /** Tooltip content describing the section */
  toolTipContent: string;
  /** Array of URLs to example model cards */
  helpUrl: string | string[];
}

/**
 * Component for displaying example links for model card sections
 */
const HelpText: React.FC<IHelpTextProps> = React.memo(({
  helpUrl
}: IHelpTextProps) => {
  const handleOpenUrl = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const urls = useMemo(() => {
    // Normalize helpUrl to array
    const urlArray = Array.isArray(helpUrl) ? helpUrl : [helpUrl];

    // Filter out empty strings and invalid URLs
    const validUrls = urlArray.filter(url => url && url.trim().length > 0);

    if (validUrls.length === 0) {
      return null;
    }

    return validUrls.map((url, idx) => (
      <Button
        key={url}
        type="link"
        style={{ padding: "1px" }}
        onClick={() => handleOpenUrl(url)}
        aria-label={`Open example ${idx + 1}`}
      >
        [Example {idx + 1}]
      </Button>
    ));
  }, [helpUrl, handleOpenUrl]);

  return urls ? <>{urls}</> : null;
});

HelpText.displayName = 'HelpText';

export default HelpText;