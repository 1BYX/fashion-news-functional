import React from "react";
import styles from "./styles/loader.module.css";

const Loader = () => {
  return (
    <div className="w-full">
      <div className={styles.ldsDualRing}></div>
    </div>
  );
};

export default Loader;
