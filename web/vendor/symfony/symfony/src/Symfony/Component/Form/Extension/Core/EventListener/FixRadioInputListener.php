<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Symfony\Component\Form\Extension\Core\EventListener;

use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\Extension\Core\ChoiceList\ChoiceListInterface;

/**
 * Takes care of converting the input from a single radio button
 * to an array.
 *
 * @author Bernhard Schussek <bschussek@gmail.com>
 */
class FixRadioInputListener implements EventSubscriberInterface
{
    private $choiceList;

    private $placeholderPresent;

    /**
     * Constructor.
     *
     * @param ChoiceListInterface $choiceList
     * @param Boolean             $placeholderPresent
     */
    public function __construct(ChoiceListInterface $choiceList, $placeholderPresent)
    {
        $this->choiceList = $choiceList;
        $this->placeholderPresent = $placeholderPresent;
    }

    public function preSubmit(FormEvent $event)
    {
        $data = $event->getData();

        // Since expanded choice fields are completely loaded anyway, we
        // can just as well get the values again without losing performance.
        $existingValues = $this->choiceList->getValues();

        if (false !== ($index = array_search($data, $existingValues, true))) {
            $data = array($index => $data);
        } elseif ('' === $data || null === $data) {
            // Empty values are always accepted.
            $data = $this->placeholderPresent ? array('placeholder' => '') : array();
        }

        // Else leave the data unchanged to provoke an error during submission

        $event->setData($data);
    }

    /**
     * Alias of {@link preSubmit()}.
     *
     * @deprecated Deprecated since version 2.3, to be removed in 3.0. Use
     *             {@link preSubmit()} instead.
     */
    public function preBind(FormEvent $event)
    {
        $this->preSubmit($event);
    }

    public static function getSubscribedEvents()
    {
        return array(FormEvents::PRE_SUBMIT => 'preSubmit');
    }
}
