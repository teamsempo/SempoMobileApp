import React from 'react'
import Svg,{
    Circle,
    Ellipse,
    G,
    Path,
    Defs,
    LinearGradient,
    Stop,
    Rect,
} from 'react-native-svg';

const UpdateDrawing = props => (
    <Svg width={92} height={162} {...props}>
        <Defs>
            <LinearGradient
                x1="50.002%"
                y1="100.689%"
                x2="50.002%"
                y2=".32%"
                id="prefix__a"
            >
                <Stop stopColor="gray" stopOpacity={0.25} offset="1%" />
                <Stop stopColor="gray" stopOpacity={0.12} offset="54%" />
                <Stop stopColor="gray" stopOpacity={0.1} offset="100%" />
            </LinearGradient>
            <LinearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="prefix__b">
                <Stop stopOpacity={0.12} offset="0%" />
                <Stop stopOpacity={0.09} offset="55%" />
                <Stop stopOpacity={0.02} offset="100%" />
            </LinearGradient>
            <LinearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="prefix__c">
                <Stop stopColor="gray" stopOpacity={0.25} offset="0%" />
                <Stop stopColor="gray" stopOpacity={0.12} offset="54%" />
                <Stop stopColor="gray" stopOpacity={0.1} offset="100%" />
            </LinearGradient>
        </Defs>
        <G fillRule="nonzero" fill="none">
            <Rect
                fill="url(#prefix__a)"
                transform="rotate(-.08 46.056 80.694)"
                x={0.347}
                y={0.387}
                width={91.418}
                height={160.612}
                rx={10}
            />
            <Rect
                fill="#FFF"
                transform="rotate(-.08 46.055 80.141)"
                x={2.452}
                y={2.083}
                width={87.208}
                height={156.116}
                rx={10}
            />
            <Path
                fill="#2D9EA0"
                d="M12.204 13.168l67.516-.094.178 127.045-67.516.094z"
            />
            <Circle
                fill="#DBDBDB"
                transform="rotate(-.08 46.154 149.318)"
                cx={46.154}
                cy={149.318}
                r={5.384}
            />
            <Circle fill="#DBDBDB" cx={35.529} cy={7.69} r={1.078} />
            <Rect
                fill="#DBDBDB"
                transform="rotate(-.08 48.916 7.192)"
                x={40.572}
                y={6.385}
                width={16.688}
                height={1.615}
                rx={0.808}
            />
            <Path fill="url(#prefix__b)" d="M46.048 38.504L22.116 81.799H69.98z" />
            <Path fill="#FFF" d="M46.048 41.837L25.003 80.128h42.09z" />
            <Circle fill="url(#prefix__c)" cx={46.048} cy={76.141} r={2.569} />
            <Circle fill="#2D9EA0" cx={46.048} cy={76.141} r={2.127} />
            <Path fill="url(#prefix__c)" d="M45.339 56.73h1.418v15.244h-1.418z" />
            <Path fill="#2D9EA0" d="M45.606 56.818h1v14.89h-1z" />
        </G>
    </Svg>
);

export default UpdateDrawing
