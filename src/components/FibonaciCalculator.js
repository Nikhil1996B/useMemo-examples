import { useMemo } from "react";
import { PropTypes } from "prop-types";

function FibonacciComponent({ n }) {
  const calculateFibonacci = (num) => {
    if (num <= 1) return 1;
    return calculateFibonacci(num - 1) + calculateFibonacci(num - 2);
  };
  const memoizedFibonacci = useMemo(() => {
    console.log("fibonacci recomputed");
    return calculateFibonacci(n);
  }, [n]);
  return (
    <div>
      The {n} th fibonacci number is {memoizedFibonacci}
    </div>
  );
}

FibonacciComponent.propTypes = {
  n: PropTypes.number,
};
