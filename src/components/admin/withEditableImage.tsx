
import { useAuth } from '@/context/AuthContext';
import EditableImage from './EditableImage';

// HOC to make any image component editable
const withEditableImage = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { user } = useAuth();
    const { src, alt, pageName, sectionName, imageId, ...rest } = props;

    // If user is not logged in, or missing required props, render original component
    if (!user || !pageName || !sectionName || !imageId) {
      return <Component {...props} />;
    }

    return (
      <EditableImage
        src={src}
        alt={alt}
        pageName={pageName}
        sectionName={sectionName}
        imageId={imageId}
        {...rest}
      />
    );
  };
};

export default withEditableImage;
