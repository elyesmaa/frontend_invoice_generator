
import React, { useState } from 'react'
import { FAQS } from '../../utils/data';
import Accordion from '../ui/Accordion';

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const handleClick = (index) => {
        setOpenIndex(index === openIndex ? null : index);
    }
    return (
        <section id="faq" className='py-20 lg:py-28 bg-white'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                    <h4 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mn-4'>Frequently Asked Questions</h4>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>Everything you need to know about Invoice Generator</p>
                </div>
                <div className='space-y-4'>
                    {FAQS.map((faq, index) => {

                        return (
                            <Accordion
                                key={index}
                                faq={faq}
                                isOpen={index === openIndex}
                                onClick={() => handleClick(index)}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Faqs
