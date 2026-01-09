import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface IllustrationHeaderProps {
    height?: number;
}

export const IllustrationHeader: React.FC<IllustrationHeaderProps> = ({ height = 200 }) => {
    return (
        <View style={[styles.container, { height }]}>
            <Image
                source={require('../assets/images/girl_image.png')}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.overlay} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        overflow: 'hidden',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,239,245, 0.2)', // Soft pink tint overlay
    },
});
