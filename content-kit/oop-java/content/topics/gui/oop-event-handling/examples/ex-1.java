import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

class CountListener implements ActionListener {
    private final JLabel label;
    private int count;
    CountListener(JLabel label) { this.label = label; }
    @Override
    public void actionPerformed(ActionEvent event) {
        count++;
        label.setText(Integer.toString(count));
    }
}

class Main {
    static void show() {
        JFrame frame = new JFrame("Click counter");
        JPanel panel = new JPanel();
        JLabel label = new JLabel("0");
        JButton button = new JButton("Count");
        button.addActionListener(new CountListener(label));
        panel.add(button);
        panel.add(label);
        frame.setContentPane(panel);

        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.pack();
        frame.setLocationByPlatform(true);
        frame.setVisible(true);
    }
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(Main::show);
    }
}
