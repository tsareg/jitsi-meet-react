import React from 'react';
import {
    Dimensions,
    TouchableHighlight,
    View
} from 'react-native';
import { connect } from 'react-redux';

import { Icon } from '../../base/fontIcons';
import { ColorPalette } from '../../base/styles';

import {
    AbstractToolbar,
    mapStateToProps
} from './AbstractToolbar';
import { styles } from './styles';

/**
 * The native container rendering the in call main buttons.
 *
 * @extends AbstractToolbar
 */
class Toolbar extends AbstractToolbar {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let underlayColor = ColorPalette.buttonUnderlay;
        let micButtonStyle;
        let micIconStyle;
        let micButtonIcon;
        if (this.props.microphoneMuted) {
            micButtonStyle = [
                styles.toolbarButton,
                { backgroundColor: underlayColor }
            ];
            micIconStyle = [styles.icon, { color: 'white' }];
            micButtonIcon = 'mic-disabled';
        }
        else {
            micButtonStyle = styles.toolbarButton;
            micIconStyle = styles.icon;
            micButtonIcon = 'microphone';
        }

        // The following property is responsible to hide/show the toolbar view
        // by moving it out of site of the screen boundaries. An attempt to use
        // the opacity property was made in order to eventually implement a
        // fadeIn/fadeOut animation, however a known React Native problem was
        // discovered, which allowed the view to still capture touch events even
        // if hidden.
        // TODO Alternatives will be investigated.
        let bottom =
            this.props.visible
                ? styles.toolbarContainer.bottom
                : -Dimensions.get('window').height;

        return (
            <View style = { [styles.toolbarContainer, { bottom }] }>

                <TouchableHighlight
                    onPress = { this._onMicrophoneMute }
                    style = { micButtonStyle }>

                    <Icon
                        name = { micButtonIcon }
                        style = { micIconStyle } />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress = { this._onHangup }
                    style = { [
                        styles.toolbarButton,
                        { backgroundColor: ColorPalette.jitsiRed }
                    ] }
                    underlayColor = { underlayColor }>

                    <Icon
                        name = "hangup"
                        style = { [styles.icon, { color: 'white' }] } />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress = { this._onCameraMute }
                    style = { styles.toolbarButton }
                    underlayColor = { underlayColor }>

                    <Icon
                        name = "photo-camera"
                        style = { styles.icon } />
                </TouchableHighlight>
            </View>
        );
    }
}

/**
 * Toolbar component's property types.
 *
 * @static
 */
Toolbar.propTypes = AbstractToolbar.propTypes;

export default connect(mapStateToProps)(Toolbar);