import { useMediaQuery, Box } from '@mui/material';

const ResponsiveLineBreak = () => {
  const isMobile = useMediaQuery('(max-width:960px)'); // 960px è il breakpoint per 'md' in Material-UI

  return (
    <Box>
      {isMobile && <br />} {/* Line break solo su mobile */}
    </Box>
  );
};

export default ResponsiveLineBreak;
