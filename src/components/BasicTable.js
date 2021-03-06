import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";

export default function BasicTable({
  title,
  headCells,
  bodyCells,
  style,
  loading = false,
}) {
  return (
    <div>
      {title && (
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      <TableContainer variant="outlined">
        <Table aria-label="information">
          <TableHead>
            <TableRow key={Date.now()}>
              {headCells.map((cell) => (
                <TableCell
                  key={cell.key}
                  align={cell.align || "left"}
                  style={{ maxWidth: cell.maxWidth || "initial" }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow key={1}>
                <TableCell align="center" colSpan={bodyCells.length}>
                  <Box
                    display="flex"
                    height={200}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={Date.now()}>
                {bodyCells.map((cell, index) => (
                  <TableCell
                    key={index}
                    {...(index === 0 ? { component: "th", scope: "row" } : {})}
                    align={headCells[index].align || "left"}
                    style={{ maxWidth: headCells[index].maxWidth || "initial" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
