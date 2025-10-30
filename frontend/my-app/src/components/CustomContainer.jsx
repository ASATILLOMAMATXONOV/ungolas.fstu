import { Container } from "@mui/material";

export default function CustomContainer({ children }) {
  return (
    <Container
      disableGutters
      sx={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {children}
    </Container>
  );
}
