import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Comment } from 'components/Comment.jsx';
import { Util } from 'helpers/Util';

jest.mock('src/helpers/Util', () => ({
  Util: {
    isComplexMediaConcept: jest.fn(),
  },
}));

describe('Comment', () => {
  let mockOnCommentChange;

  beforeEach(() => {
    mockOnCommentChange = jest.fn();
    Util.isComplexMediaConcept.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render add comment button', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should render the comment section on click of button', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should hide the comment section on click of button if it is shown', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should set comment', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('button'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New Comment' } });

    expect(mockOnCommentChange).toHaveBeenCalledWith('New Comment');
  });

  it('should set comment with undefined if filled with empty spaces', () => {
    render(<Comment onCommentChange={mockOnCommentChange} />);

    fireEvent.click(screen.getByRole('button'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '   ' } });

    expect(mockOnCommentChange).toHaveBeenCalledWith(undefined);
  });

  it('should render comment section with default value', () => {
    render(<Comment comment="Some Comment" onCommentChange={mockOnCommentChange} />);

    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveValue('Some Comment');
  });

  it('should not render comment button when the control is of complex media type', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render comment button when the control is of complex but not media type', () => {
    Util.isComplexMediaConcept.mockReturnValue(false);

    render(
      <Comment
        conceptHandler="LocationHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render comment section when the complex Media type control has value', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
        value="someValue"
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should not render comment section when the complex media control does not have value', () => {
    Util.isComplexMediaConcept.mockReturnValue(true);

    render(
      <Comment
        conceptHandler="ImageUrlHandler"
        datatype="Complex"
        onCommentChange={mockOnCommentChange}
        value={undefined}
      />
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  describe('forceOpen', () => {
    it('should render comment section open when forceOpen is true on initial render', () => {
      render(<Comment forceOpen onCommentChange={mockOnCommentChange} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open comment section when forceOpen prop transitions from false to true', () => {
      const { rerender } = render(<Comment forceOpen={false} onCommentChange={mockOnCommentChange} />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

      rerender(<Comment forceOpen onCommentChange={mockOnCommentChange} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should not close comment section when forceOpen transitions from true to false', () => {
      const { rerender } = render(<Comment forceOpen onCommentChange={mockOnCommentChange} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      rerender(<Comment forceOpen={false} onCommentChange={mockOnCommentChange} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('clearNotes', () => {
    it('should remove has-notes class from button when comment prop is cleared', () => {
      const { rerender } = render(
        <Comment comment="existing note" onCommentChange={mockOnCommentChange} />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveClass('has-notes');

      rerender(<Comment comment={undefined} onCommentChange={mockOnCommentChange} />);

      expect(screen.getByRole('button')).not.toHaveClass('has-notes');
    });
  });
});
