import React, { useState } from "react";
import classNames from "classnames";
import Image from "next/image";

import styles from "./style.module.scss";

interface MaterialItem {
  textureUrl: string;
  name?: string;
  color?: string; // Add color property for solid colors
}

type Props = {
  materials: MaterialItem[];
  activeMaterials?: string[];
  onChange: (textureUrl: string) => void;
  title?: string; // Add title prop
};

const MaterialPicker: React.FC<Props> = ({ materials = [], activeMaterials = [], onChange, title = "Material" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Error handling: Check if materials array is empty or invalid
  if (!materials || materials.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noMaterials}>
          <span>No materials available</span>
        </div>
      </div>
    );
  }

  // Filter out materials that don't have valid textureUrl or color
  const validMaterials = materials.filter((material) => {
    if (!material) return false;
    return material.textureUrl || material.color;
  });

  // If no valid materials after filtering
  if (validMaterials.length === 0) {
    return (
      <div className={styles.container}>
        {/* {title && <h3 className={styles.title}>{title}</h3>} */}
        <div className={styles.noMaterials}>
          <span>No valid materials available</span>
        </div>
      </div>
    );
  }

  // Get the currently selected material with fallback
  const selectedMaterial = validMaterials.find((mat) => activeMaterials.includes(mat.textureUrl)) || validMaterials[0];

  const handleMaterialSelect = (textureUrl: string) => {
    try {
      onChange(textureUrl);
      setIsOpen(false);
    } catch (error) {
      console.error("Error selecting material:", error);
    }
  };

  const handleImageError = (textureUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(textureUrl));
  };

  const renderColorSwatch = (material: MaterialItem) => {
    if (!material) return null;

    if (material.color) {
      // Render solid color swatch
      return (
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: material.color }}
          title={material.name || material.color}
        />
      );
    } else if (material.textureUrl && !imageErrors.has(material.textureUrl)) {
      // Render image texture using Next.js Image component
      return (
        <div className={styles.imageWrapper}>
          <Image
            src={material.textureUrl}
            alt={`Material-${material.name || material.textureUrl}`}
            className={styles.textureSwatch}
            width={40} // Set appropriate width
            height={40} // Set appropriate height
            sizes="40px" // Optimize for the expected display size
            quality={75} // Adjust quality as needed
            priority={false} // Set to true for above-the-fold images
            onError={() => handleImageError(material.textureUrl)}
            onLoad={() => {
              // Remove from error set if it loads successfully after a previous error
              setImageErrors((prev) => {
                const newSet = new Set(prev);
                newSet.delete(material.textureUrl);
                return newSet;
              });
            }}
            // Additional Next.js Image props you might need:
            // placeholder="blur" // if you want to show a blur placeholder
            // blurDataURL="data:image/jpeg;base64,..." // base64 blur placeholder
            // unoptimized={true} // if you want to disable optimization
          />
        </div>
      );
    } else {
      // Fallback for failed images or missing texture
      return (
        <div className={styles.fallbackSwatch}>
          <span>?</span>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* {title && <h3 className={styles.title}>{title}</h3>} */}

      <div className={styles.dropdown}>
        {/* Selected Material Display */}
        <button
          type="button"
          className={classNames(styles.selectedButton)}
          onClick={() => setIsOpen(!isOpen)}
          disabled={!selectedMaterial}
        >
          <div className={styles.selectedContent}>
            {selectedMaterial && renderColorSwatch(selectedMaterial)}
            <span className={styles.selectedLabel}>
              {selectedMaterial?.name
                ? String(selectedMaterial.name)
                : selectedMaterial
                  ? "Unnamed Material"
                  : "No Material Selected"}
            </span>
          </div>
          <div className={classNames(styles.chevron, { [styles.open]: isOpen })}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {validMaterials.length > 0 ? (
              validMaterials.map((mat, index) => (
                <button
                  type="button"
                  key={`${mat.textureUrl || mat.color}-${index}`}
                  className={classNames(styles.dropdownItem, {
                    [styles.active]: activeMaterials?.includes(mat.textureUrl),
                  })}
                  onClick={() => handleMaterialSelect(mat.textureUrl)}
                  disabled={!mat.textureUrl}
                >
                  {renderColorSwatch(mat)}
                  <span className={styles.itemLabel}>
                    {mat.name ? String(mat.name) : mat.color ? `Color: ${mat.color}` : "Unnamed Material"}
                  </span>
                </button>
              ))
            ) : (
              <div className={styles.dropdownEmpty}>
                <span>No materials to display</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialPicker;
