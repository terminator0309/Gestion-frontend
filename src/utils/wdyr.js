import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

const MODE = import.meta.env.MODE;

if (MODE === 'development' && typeof window !== 'undefined') {
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    })
}